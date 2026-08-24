/**
 * queries.ts — Prisma rows in, frozen view models out.
 *
 * Every function here returns exactly the shapes in view-models.ts; no Prisma
 * type escapes. Period boundaries are always recomputed through the pure
 * engine (periods.ts) via the same `periodInputFor` the materializer uses, so
 * the DB rows are joined by periodStart rather than trusted for shape.
 *
 * Money rules enforced here:
 *  - `usedCents` shown to the user is the RAW entered sum; ROI clamps usage
 *    at face value so over-recording can never inflate a card's captured value.
 *  - Only STATEMENT_CREDIT and POINTS_GRANT feed dollar rollups.
 *    SPEND_THRESHOLD and PERK are displayed, never converted to dollars.
 *  - Points convert at the user's selected RedemptionMethod for the card's
 *    currency (UserPointsPreference, default DEFAULT).
 */
import type { CardArtSpec } from '@/catalog/types';
import { compareCivil, diffDays, type CivilDate } from '@/lib/civil';
import { prisma } from '@/lib/db';
import { ensurePeriods, periodInputFor } from '@/lib/ensure-periods';
import { formatCents } from '@/lib/format';
import { pointsToCents } from '@/lib/money';
import { periodFor, periodsInYear, type Period } from '@/lib/periods';
import { isFeeWorthIt, projectedCents, rollup, rollupMany, type PeriodFact, type Rollup } from '@/lib/roi';
import type {
  BenefitKind,
  BenefitPeriodVM,
  BenefitVM,
  CardRoiVM,
  CardVM,
  CatalogEntryVM,
  PeriodStatus,
  TrackerGroup,
  TrackerItemVM,
  TrackerVM,
} from '@/lib/view-models';
import type { Prisma } from '@/generated/prisma/client';

/** v1 is single-user; every user-scoped row belongs to this id. */
export const LOCAL_USER_ID = 'local';

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

const walletCardInclude = {
  cardProduct: {
    include: {
      issuer: true,
      pointsCurrency: { include: { valuations: true } },
      rewards: { orderBy: { sortOrder: 'asc' as const } },
    },
  },
  benefits: {
    where: { benefit: { retiredAt: null } },
    include: {
      benefit: true,
      periods: { include: { entries: true } },
    },
  },
} satisfies Prisma.UserCardInclude;

type WalletCardRow = Prisma.UserCardGetPayload<{ include: typeof walletCardInclude }>;
type UcbRow = WalletCardRow['benefits'][number];

/** Materialize current-year periods for every wallet card, then read them back. */
async function loadWalletRows(asOf: CivilDate): Promise<WalletCardRow[]> {
  const ids = await prisma.userCard.findMany({
    where: { userId: LOCAL_USER_ID, removedAt: null },
    select: { id: true },
  });
  for (const { id } of ids) await ensurePeriods(id, asOf);
  return prisma.userCard.findMany({
    where: { userId: LOCAL_USER_ID, removedAt: null },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: walletCardInclude,
  });
}

/** currencySlug → the user's chosen RedemptionMethod (missing = DEFAULT). */
async function loadMethodByCurrency(): Promise<Map<string, string>> {
  const prefs = await prisma.userPointsPreference.findMany({ where: { userId: LOCAL_USER_ID } });
  return new Map(prefs.map((p) => [p.currencySlug, p.method]));
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/** 8 → "8", 1.5 → "1.5", 2.05 → "2.05" — numbers without trailing zero noise. */
function trimNumber(n: number): string {
  return String(Math.round(n * 100) / 100);
}

function valuationMilliFor(
  valuations: { method: string; milliCentsPerPoint: number }[],
  method: string,
): number | null {
  return (
    valuations.find((v) => v.method === method)?.milliCentsPerPoint ??
    valuations.find((v) => v.method === 'DEFAULT')?.milliCentsPerPoint ??
    null
  );
}

/**
 * The preformatted cadence strings the screens render verbatim:
 * "$300 per year", "$150 twice a year • $300 total", "$25 per month • $300
 * total", "$100 quarterly • $400 total", "$120 every 4 years",
 * "$75,000 annual spend", "Ongoing".
 */
function cadenceLabelFor(
  kind: BenefitKind,
  cadence: string,
  perPeriodCents: number,
  everyNYears: number | null,
): string {
  if (kind === 'PERK') return 'Ongoing';
  const amt = formatCents(perPeriodCents);
  if (kind === 'SPEND_THRESHOLD') return `${amt} annual spend`;
  switch (cadence) {
    case 'ANNUAL':
      return `${amt} per year`;
    case 'SEMIANNUAL':
      return `${amt} twice a year • ${formatCents(perPeriodCents * 2)} total`;
    case 'QUARTERLY':
      return `${amt} quarterly • ${formatCents(perPeriodCents * 4)} total`;
    case 'MONTHLY':
      return `${amt} per month • ${formatCents(perPeriodCents * 12)} total`;
    case 'EVERY_N_YEARS': {
      const n = everyNYears ?? 1;
      return n > 1 ? `${amt} every ${n} years` : `${amt} per year`;
    }
    case 'ONE_TIME':
      return `${amt} one time`;
    default:
      return 'Ongoing';
  }
}

// ---------------------------------------------------------------------------
// Benefit + card assembly
// ---------------------------------------------------------------------------

interface BuiltBenefit {
  vm: BenefitVM;
  /** Whether the user tracks this benefit (untracked ones stay off the tracker). */
  tracked: boolean;
  /** ROI facts for the whole current benefit year. [] for thresholds/perks. */
  facts: PeriodFact[];
  /** Every already-started period this benefit year — feeds tracker buckets. */
  startedPeriods: BenefitPeriodVM[];
}

function buildBenefit(
  ucb: UcbRow,
  card: { openedAt: string | null; statementDayOfMonth: number | null },
  milliCentsPerPoint: number | null,
  asOf: CivilDate,
): BuiltBenefit {
  const b = ucb.benefit;
  const kind = b.type as BenefitKind;

  const liveValueCents = (): number => {
    switch (kind) {
      case 'STATEMENT_CREDIT':
        return ucb.customValueCents ?? b.valueCents ?? 0;
      case 'POINTS_GRANT':
        return milliCentsPerPoint != null && b.valuePoints != null
          ? pointsToCents(b.valuePoints, milliCentsPerPoint)
          : 0;
      case 'SPEND_THRESHOLD':
        return b.thresholdCents ?? 0;
      default:
        return 0;
    }
  };

  const base = {
    slug: b.slug,
    kind,
    title: b.title,
    shortTitle: b.shortTitle,
    description: b.description,
    brandKey: b.brandKey ?? undefined,
    cadenceLabel: cadenceLabelFor(kind, b.cadence, liveValueCents(), b.everyNYears),
    isHighlighted: b.isHighlighted,
    registerByDate: b.registerByDate ?? undefined,
  };

  if (kind === 'PERK') {
    return { vm: { ...base, currentPeriod: null }, tracked: ucb.isTracked, facts: [], startedPeriods: [] };
  }

  const input = periodInputFor(b, ucb, card);
  const year = periodsInYear(input, asOf);
  const dbByStart = new Map(ucb.periods.map((p) => [p.periodStart, p]));

  /** Face value of one period: the frozen snapshot when materialized, else the live value. */
  const valueOf = (db: UcbRow['periods'][number] | undefined): number => {
    if (!db) return liveValueCents();
    switch (kind) {
      case 'STATEMENT_CREDIT':
        return db.valueCentsSnapshot ?? liveValueCents();
      case 'POINTS_GRANT': {
        const pts = db.valuePointsSnapshot ?? b.valuePoints;
        return milliCentsPerPoint != null && pts != null ? pointsToCents(pts, milliCentsPerPoint) : 0;
      }
      default:
        return db.thresholdCentsSnapshot ?? liveValueCents();
    }
  };

  /** Raw usage of one period: REDEEM/SPEND sum amountCents; GRANT sums points, then converts. */
  const usedOf = (db: UcbRow['periods'][number] | undefined): number => {
    if (!db) return 0;
    let cents = 0;
    let points = 0;
    for (const e of db.entries) {
      if (e.kind === 'GRANT') points += e.amountPoints ?? 0;
      else cents += e.amountCents ?? 0;
    }
    if (kind === 'POINTS_GRANT') {
      return milliCentsPerPoint != null ? pointsToCents(points, milliCentsPerPoint) : 0;
    }
    return cents;
  };

  const toVM = (p: Period): BenefitPeriodVM => {
    const db = dbByStart.get(p.start);
    const value = valueOf(db);
    const used = usedOf(db);
    const opened = compareCivil(p.start, asOf) <= 0;
    const closed = compareCivil(p.end, asOf) <= 0;
    const status: PeriodStatus = closed ? 'closed' : opened ? 'open' : 'future';
    return {
      id: db?.id ?? null,
      start: p.start,
      end: p.end,
      label: p.label,
      status,
      valueCents: value,
      usedCents: used, // raw entered figure — display never clamps
      remainingCents: Math.max(0, value - used),
      percentUsed:
        value > 0 ? Math.min(100, Math.max(0, Math.round((used / value) * 100))) : used > 0 ? 100 : 0,
      daysLeft: diffDays(asOf, p.end), // period.end is EXCLUSIVE
    };
  };

  const startedPeriods = year.filter((p) => compareCivil(p.start, asOf) <= 0).map(toVM);
  const current = periodFor(input, asOf);
  const currentPeriod = current
    ? (startedPeriods.find((v) => v.start === current.start) ?? toVM(current))
    : null;

  // ROI facts span the FULL benefit year (future buckets count as unopened),
  // for dollar-valued benefits only — and usage is clamped at face value.
  const facts: PeriodFact[] =
    kind === 'STATEMENT_CREDIT' || kind === 'POINTS_GRANT'
      ? year.map((p) => {
          const db = dbByStart.get(p.start);
          const value = valueOf(db);
          return { start: p.start, end: p.end, valueCents: value, usedCents: Math.min(usedOf(db), value) };
        })
      : [];

  return { vm: { ...base, currentPeriod }, tracked: ucb.isTracked, facts, startedPeriods };
}

interface BuiltCard {
  vm: CardVM;
  rollup: Rollup;
  benefits: BuiltBenefit[];
}

function buildCard(row: WalletCardRow, methodByCurrency: Map<string, string>, asOf: CivilDate): BuiltCard {
  const product = row.cardProduct;
  const currency = product.pointsCurrency;
  const method = (currency ? methodByCurrency.get(currency.slug) : undefined) ?? 'DEFAULT';
  const milli = currency ? valuationMilliFor(currency.valuations, method) : null;

  const ucbs = [...row.benefits].sort((a, b) => a.benefit.sortOrder - b.benefit.sortOrder);
  const benefits = ucbs.map((ucb) => buildBenefit(ucb, row, milli, asOf));

  const redeemable: BenefitVM[] = [];
  const other: BenefitVM[] = [];
  const facts: PeriodFact[] = [];
  for (const built of benefits) {
    if (built.vm.kind === 'STATEMENT_CREDIT' || built.vm.kind === 'POINTS_GRANT') {
      redeemable.push(built.vm);
      facts.push(...built.facts);
    } else {
      other.push(built.vm);
    }
  }

  const r = rollup(facts, asOf);
  const roi: CardRoiVM = {
    ...r,
    annualFeeCents: product.annualFeeCents,
    netCents: r.capturedCents - product.annualFeeCents,
    projectedNetCents: projectedCents(r) - product.annualFeeCents,
    isWorthItToday: isFeeWorthIt(r.capturedCents, product.annualFeeCents),
  };

  const vm: CardVM = {
    userCardId: row.id,
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    issuerDisplayName: product.issuer.displayName,
    issuerBrandColor: product.issuer.brandColor,
    network: product.network,
    last4: row.last4,
    art: product.art as unknown as CardArtSpec,
    annualFeeLabel: formatCents(product.annualFeeCents),
    aprLabel: `${(product.aprLowBps / 100).toFixed(2)}% - ${(product.aprHighBps / 100).toFixed(2)}%`,
    foreignTxFeeLabel:
      product.foreignTxFeeBps == null ? 'None' : `${trimNumber(product.foreignTxFeeBps / 100)}%`,
    dataAsOf: product.dataAsOf,
    sourceUrl: product.sourceUrl,
    pointsCurrencyName: currency?.name ?? null,
    redemptionMethod: method as CardVM['redemptionMethod'],
    centsPerPointLabel:
      currency && milli != null
        ? `${trimNumber(milli / 1000)}¢ per ${/mile/i.test(currency.name) ? 'mile' : 'point'}`
        : null,
    rewards: product.rewards.map((rw) => ({
      multiplierLabel: `${trimNumber(rw.multiplierX100 / 100)}x`,
      category: rw.category,
      description: rw.description,
      endsOn: rw.endsOn ?? undefined,
    })),
    redeemable,
    other,
    roi,
  };

  return { vm, rollup: r, benefits };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getWalletCards(asOf: CivilDate): Promise<CardVM[]> {
  const rows = await loadWalletRows(asOf);
  const prefs = await loadMethodByCurrency();
  return rows.map((row) => buildCard(row, prefs, asOf).vm);
}

export async function getCardDetail(userCardId: string, asOf: CivilDate): Promise<CardVM | null> {
  const probe = await prisma.userCard.findFirst({
    where: { id: userCardId, userId: LOCAL_USER_ID, removedAt: null },
    select: { id: true },
  });
  if (!probe) return null;
  await ensurePeriods(userCardId, asOf);
  const row = await prisma.userCard.findFirst({
    where: { id: userCardId, userId: LOCAL_USER_ID, removedAt: null },
    include: walletCardInclude,
  });
  if (!row) return null;
  const prefs = await loadMethodByCurrency();
  return buildCard(row, prefs, asOf).vm;
}

const GROUP_ORDER: TrackerGroup[] = ['expiring', 'available', 'used', 'missed', 'untracked'];

const GROUP_LABELS: Record<TrackerGroup, string> = {
  expiring: 'Expiring soon',
  available: 'Available now',
  used: 'Used',
  missed: 'Missed',
  untracked: 'Not tracked',
};

/** daysLeft ascending, then remaining descending (perks stay in catalog order). */
function sortItems(items: TrackerItemVM[]): void {
  items.sort((a, b) => {
    const da = a.currentPeriod?.daysLeft ?? Number.POSITIVE_INFINITY;
    const db = b.currentPeriod?.daysLeft ?? Number.POSITIVE_INFINITY;
    if (da !== db) return da - db;
    return (b.currentPeriod?.remainingCents ?? 0) - (a.currentPeriod?.remainingCents ?? 0);
  });
}

/**
 * Wallet-wide tracker. Emits one item per STARTED period of the current
 * benefit year, so a semiannual credit shows its missed Jan–Jun bucket and
 * its open Jul–Dec bucket as independent rows:
 *   expiring — open, remaining > 0, daysLeft <= 30
 *   available — open, remaining > 0, daysLeft > 30
 *   used — remaining <= 0 (open or closed: captured is captured)
 *   missed — closed with remaining > 0 (permanently forfeited)
 *   untracked — PERKs (no dollar value to track)
 */
/**
 * Collapse repeated missed buckets of the same benefit into one row.
 *
 * A $10/month credit that went unused from January to July is seven closed
 * periods. Listing them individually is literally true but buries the fact
 * that matters — $70 is gone — under seven near-identical rows, and pushes
 * genuinely distinct misses off the screen. One row per benefit, carrying the
 * summed value and the full date span, says the same thing in the form
 * someone can act on.
 *
 * Display only: group totals come from the rollup, which is computed per
 * period and is unaffected by this.
 */
function collapseMissed(items: TrackerItemVM[]): TrackerItemVM[] {
  const byBenefit = new Map<string, TrackerItemVM[]>();
  for (const item of items) {
    const key = `${item.userCardId}:${item.slug}`;
    const list = byBenefit.get(key);
    if (list) list.push(item);
    else byBenefit.set(key, [item]);
  }

  const out: TrackerItemVM[] = [];
  for (const group of byBenefit.values()) {
    if (group.length === 1 || !group[0].currentPeriod) {
      out.push(group[0]);
      continue;
    }
    const periods = group
      .map((g) => g.currentPeriod!)
      .sort((a, b) => compareCivil(a.start, b.start));
    const first = periods[0];
    const last = periods[periods.length - 1];
    const valueCents = periods.reduce((sum, p) => sum + (p.valueCents ?? 0), 0);
    const usedCents = periods.reduce((sum, p) => sum + p.usedCents, 0);
    const remainingCents = periods.reduce((sum, p) => sum + p.remainingCents, 0);

    out.push({
      ...group[0],
      currentPeriod: {
        ...last,
        id: null, // spans several rows; no single period to link to
        start: first.start,
        end: last.end,
        label: `${periods.length} periods · ${first.label} – ${last.label}`,
        valueCents,
        usedCents,
        remainingCents,
        percentUsed: valueCents > 0 ? Math.min(100, Math.round((usedCents / valueCents) * 100)) : 0,
        daysLeft: last.daysLeft,
      },
    });
  }
  return out;
}

export async function getTracker(asOf: CivilDate): Promise<TrackerVM> {
  const rows = await loadWalletRows(asOf);
  const prefs = await loadMethodByCurrency();

  const buckets: Record<TrackerGroup, TrackerItemVM[]> = {
    expiring: [],
    available: [],
    used: [],
    missed: [],
    untracked: [],
  };
  const cardRollups: Rollup[] = [];

  for (const row of rows) {
    const built = buildCard(row, prefs, asOf);
    cardRollups.push(built.rollup);
    const lift = {
      userCardId: built.vm.userCardId,
      cardShortName: built.vm.shortName,
      cardArt: built.vm.art,
    };
    for (const benefit of built.benefits) {
      if (benefit.vm.kind === 'PERK') {
        buckets.untracked.push({ ...benefit.vm, ...lift });
        continue;
      }
      if (!benefit.tracked) continue;
      for (const period of benefit.startedPeriods) {
        if ((period.valueCents ?? 0) <= 0 && period.usedCents <= 0) continue; // nothing to show
        const item: TrackerItemVM = { ...benefit.vm, ...lift, currentPeriod: period };
        if (period.remainingCents <= 0) buckets.used.push(item);
        else if (period.status === 'closed') buckets.missed.push(item);
        else if (period.daysLeft <= 30) buckets.expiring.push(item);
        else buckets.available.push(item);
      }
    }
  }

  buckets.missed = collapseMissed(buckets.missed);

  for (const key of GROUP_ORDER) {
    if (key !== 'untracked') sortItems(buckets[key]);
  }

  return {
    groups: GROUP_ORDER.map((key) => ({ key, label: GROUP_LABELS[key], items: buckets[key] })),
    totals: rollupMany(cardRollups),
  };
}

export async function getCatalogEntries(): Promise<CatalogEntryVM[]> {
  const products = await prisma.cardProduct.findMany({
    where: { retiredAt: null },
    include: {
      issuer: true,
      benefits: { where: { retiredAt: null }, select: { slug: true } },
      userCards: { where: { userId: LOCAL_USER_ID, removedAt: null }, select: { id: true } },
    },
    orderBy: { name: 'asc' },
  });
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    shortName: p.shortName,
    issuerDisplayName: p.issuer.displayName,
    network: p.network,
    annualFeeLabel: formatCents(p.annualFeeCents),
    art: p.art as unknown as CardArtSpec,
    benefitCount: p.benefits.length,
    alreadyInWallet: p.userCards.length > 0,
  }));
}

// ---------------------------------------------------------------------------
// Client wiring (ids the frozen view models deliberately do not carry)
// ---------------------------------------------------------------------------

export interface WalletWiring {
  /** userCardId → points currency slug (cards with no currency are absent). */
  currencySlugByCardId: Record<string, string>;
  /** `${userCardId}:${benefitSlug}` → userCardBenefitId, for record/undo actions. */
  benefitIdByKey: Record<string, string>;
}

/**
 * CardVM is frozen and carries no DB ids beyond userCardId, but the client
 * screen must call actions keyed by userCardBenefitId and currency slug.
 * This side-channel map keeps the view-model contract intact.
 */
export async function getWalletWiring(): Promise<WalletWiring> {
  const rows = await prisma.userCard.findMany({
    where: { userId: LOCAL_USER_ID, removedAt: null },
    select: {
      id: true,
      cardProduct: { select: { pointsCurrencySlug: true } },
      benefits: { select: { id: true, benefitSlug: true } },
    },
  });
  const currencySlugByCardId: Record<string, string> = {};
  const benefitIdByKey: Record<string, string> = {};
  for (const row of rows) {
    if (row.cardProduct.pointsCurrencySlug) {
      currencySlugByCardId[row.id] = row.cardProduct.pointsCurrencySlug;
    }
    for (const ucb of row.benefits) {
      benefitIdByKey[`${row.id}:${ucb.benefitSlug}`] = ucb.id;
    }
  }
  return { currencySlugByCardId, benefitIdByKey };
}

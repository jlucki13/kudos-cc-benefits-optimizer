/**
 * ensure-periods.ts — lazily materialize BenefitPeriod rows for a card.
 *
 * There is no cron. On every read (page load / query) we upsert the periods
 * of the CURRENT benefit year that have already started — the one containing
 * asOf plus any elapsed sibling buckets (so the tracker can show "Missed").
 *
 * Snapshot semantics: a period freezes the face value that was in force when
 * it was first materialized. The upsert's update branch therefore never
 * touches `*Snapshot` columns — only the computed boundary metadata
 * (periodEnd, label), which must track a changed openedAt/statement day.
 *
 * Idempotent by construction: every write is an upsert keyed on
 * @@unique([userCardBenefitId, periodStart]).
 */
import { compareCivil, type CivilDate } from '@/lib/civil';
import { prisma } from '@/lib/db';
import { periodsInYear, type Cadence, type PeriodInput, type ResetBasis } from '@/lib/periods';

interface BenefitShape {
  type: string;
  cadence: string;
  defaultResetBasis: string;
  valueCents: number | null;
  valuePoints: number | null;
  thresholdCents: number | null;
  everyNYears: number | null;
  windowStart: string | null;
  windowEnd: string | null;
}

interface UserCardBenefitShape {
  resetBasisOverride: string | null;
  anchorOverride: string | null;
  customValueCents: number | null;
}

interface UserCardShape {
  openedAt: string | null;
  statementDayOfMonth: number | null;
}

/**
 * The PeriodInput for one benefit on one card: catalog terms + the user's
 * per-card overrides (`resetBasisOverride ?? defaultResetBasis`,
 * `anchorOverride ?? openedAt`). Shared by ensurePeriods, the query layer and
 * the record-redemption action so all three always agree on boundaries.
 */
export function periodInputFor(
  benefit: BenefitShape,
  ucb: UserCardBenefitShape,
  card: UserCardShape,
): PeriodInput {
  return {
    cadence: benefit.cadence as Cadence,
    basis: (ucb.resetBasisOverride ?? benefit.defaultResetBasis) as ResetBasis,
    openedAt: ucb.anchorOverride ?? card.openedAt,
    statementDayOfMonth: card.statementDayOfMonth,
    windowStart: benefit.windowStart,
    windowEnd: benefit.windowEnd,
    everyNYears: benefit.everyNYears,
  };
}

/** The frozen-value columns for a newly created period. */
export function snapshotFor(benefit: BenefitShape, ucb: UserCardBenefitShape) {
  return {
    valueCentsSnapshot: benefit.type === 'STATEMENT_CREDIT' ? (ucb.customValueCents ?? benefit.valueCents) : null,
    valuePointsSnapshot: benefit.type === 'POINTS_GRANT' ? benefit.valuePoints : null,
    thresholdCentsSnapshot: benefit.type === 'SPEND_THRESHOLD' ? benefit.thresholdCents : null,
  };
}

/**
 * Materialize every already-started period of the current benefit year for
 * each tracked, non-retired benefit on the card. Safe on every page load.
 */
export async function ensurePeriods(userCardId: string, asOf: CivilDate): Promise<void> {
  const card = await prisma.userCard.findUnique({
    where: { id: userCardId },
    include: {
      benefits: {
        where: { isTracked: true, benefit: { retiredAt: null } },
        include: { benefit: true },
      },
    },
  });
  if (!card || card.removedAt) return;

  const writes = [];
  for (const ucb of card.benefits) {
    const benefit = ucb.benefit;
    // PERKs have no value and no periods (view-model: currentPeriod is null).
    if (benefit.type === 'PERK') continue;

    const input = periodInputFor(benefit, ucb, card);
    // All buckets of the benefit year containing asOf, keeping only those
    // already started — the current one plus elapsed ("Missed") siblings.
    // periodsInYear is [] for NONE cadence and outside fixed windows.
    const started = periodsInYear(input, asOf).filter((p) => compareCivil(p.start, asOf) <= 0);
    if (started.length === 0) continue;

    for (const p of started) {
      writes.push(
        prisma.benefitPeriod.upsert({
          where: { userCardBenefitId_periodStart: { userCardBenefitId: ucb.id, periodStart: p.start } },
          // Update refreshes only computed boundary metadata; snapshots stay frozen.
          update: { periodEnd: p.end, label: p.label },
          create: {
            userCardBenefitId: ucb.id,
            periodStart: p.start,
            periodEnd: p.end,
            label: p.label,
            ...snapshotFor(benefit, ucb),
          },
        }),
      );
    }
  }
  if (writes.length > 0) await prisma.$transaction(writes);
}

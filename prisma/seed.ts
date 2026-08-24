/**
 * Catalog seed.
 *
 * Two rules govern this file:
 *   1. It is idempotent. Every write is an upsert keyed on a deterministic slug,
 *      so re-running it after a catalog edit updates terms in place.
 *   2. It NEVER touches user tables (User, UserCard, UserCardBenefit,
 *      BenefitPeriod, BenefitEntry). Benefits that disappear from the catalog are
 *      marked `retiredAt` rather than deleted, because a user's historical
 *      redemptions still point at them.
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { issuers, pointsCurrencies, cards } from '../src/catalog';
import type { SeedBenefit } from '../src/catalog/types';
import type { Prisma } from '../src/generated/prisma/client';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

const today = new Date().toISOString().slice(0, 10);

/** Buckets per benefit year. Derived, never hand-written in card files. */
function periodsPerYear(cadence: SeedBenefit['cadence']): number {
  switch (cadence) {
    case 'MONTHLY': return 12;
    case 'QUARTERLY': return 4;
    case 'SEMIANNUAL': return 2;
    case 'ANNUAL': return 1;
    case 'EVERY_N_YEARS': return 1;
    case 'ONE_TIME': return 1;
    case 'NONE': return 0;
  }
}

async function main() {
  // The single local user. No auth in v1.
  await prisma.user.upsert({
    where: { id: 'local' },
    update: {},
    create: { id: 'local' },
  });

  for (const i of issuers) {
    await prisma.issuer.upsert({
      where: { slug: i.slug },
      update: { name: i.name, displayName: i.displayName, brandColor: i.brandColor },
      create: i,
    });
  }

  for (const c of pointsCurrencies) {
    await prisma.pointsCurrency.upsert({
      where: { slug: c.slug },
      update: { name: c.name, shortName: c.shortName },
      create: { slug: c.slug, name: c.name, shortName: c.shortName },
    });
    for (const v of c.valuations) {
      const id = `${c.slug}:${v.method}`;
      await prisma.pointsValuation.upsert({
        where: { id },
        update: {
          milliCentsPerPoint: v.milliCentsPerPoint,
          label: v.label,
          notes: v.notes ?? null,
        },
        create: {
          id,
          currencySlug: c.slug,
          method: v.method,
          milliCentsPerPoint: v.milliCentsPerPoint,
          label: v.label,
          notes: v.notes ?? null,
        },
      });
    }
  }

  for (const card of cards) {
    await prisma.cardProduct.upsert({
      where: { slug: card.slug },
      update: {
        issuerSlug: card.issuer,
        name: card.name,
        shortName: card.shortName,
        network: card.network,
        annualFeeCents: card.annualFeeCents,
        aprLowBps: card.aprLowBps,
        aprHighBps: card.aprHighBps,
        foreignTxFeeBps: card.foreignTxFeeBps,
        pointsCurrencySlug: card.pointsCurrency ?? null,
        art: card.art as unknown as Prisma.InputJsonValue,
        dataAsOf: card.dataAsOf,
        sourceUrl: card.sourceUrl,
        retiredAt: null,
      },
      create: {
        slug: card.slug,
        issuerSlug: card.issuer,
        name: card.name,
        shortName: card.shortName,
        network: card.network,
        annualFeeCents: card.annualFeeCents,
        aprLowBps: card.aprLowBps,
        aprHighBps: card.aprHighBps,
        foreignTxFeeBps: card.foreignTxFeeBps,
        pointsCurrencySlug: card.pointsCurrency ?? null,
        art: card.art as unknown as Prisma.InputJsonValue,
        dataAsOf: card.dataAsOf,
        sourceUrl: card.sourceUrl,
      },
    });

    // Reward rates carry no user references, so replace wholesale — simpler and
    // keeps sortOrder contiguous when a card's earn structure changes.
    await prisma.rewardRate.deleteMany({ where: { cardProductSlug: card.slug } });
    await prisma.rewardRate.createMany({
      data: card.rewards.map((r, idx) => ({
        id: `${card.slug}:reward:${idx}`,
        cardProductSlug: card.slug,
        multiplierX100: r.multiplierX100,
        category: r.category,
        description: r.description,
        endsOn: r.endsOn ?? null,
        sortOrder: idx,
      })),
    });

    // Benefits are referenced by user rows: upsert, never delete.
    const seenSlugs = new Set<string>();
    for (const [idx, b] of card.benefits.entries()) {
      seenSlugs.add(b.slug);
      const shared = {
        cardProductSlug: card.slug,
        type: b.type,
        title: b.title,
        shortTitle: b.shortTitle,
        description: b.description,
        brandKey: b.brandKey ?? null,
        valueCents: b.type === 'STATEMENT_CREDIT' ? b.valueCents : null,
        valuePoints: b.type === 'POINTS_GRANT' ? b.valuePoints : null,
        thresholdCents: b.type === 'SPEND_THRESHOLD' ? b.thresholdCents : null,
        cadence: b.cadence,
        periodsPerYear: periodsPerYear(b.cadence),
        defaultResetBasis: b.resetBasis,
        everyNYears: b.everyNYears ?? null,
        windowStart: b.windowStart ?? null,
        windowEnd: b.windowEnd ?? null,
        registerByDate: b.registerByDate ?? null,
        isHighlighted: b.isHighlighted ?? false,
        sortOrder: idx,
        retiredAt: null,
      };
      await prisma.benefit.upsert({
        where: { slug: b.slug },
        update: shared,
        create: { slug: b.slug, ...shared },
      });
    }

    // A benefit pulled from the catalog is retired, not removed — user history
    // still references it.
    await prisma.benefit.updateMany({
      where: { cardProductSlug: card.slug, slug: { notIn: [...seenSlugs] }, retiredAt: null },
      data: { retiredAt: today },
    });
  }

  const [nCards, nBenefits, nRewards] = await Promise.all([
    prisma.cardProduct.count(),
    prisma.benefit.count(),
    prisma.rewardRate.count(),
  ]);
  console.log(`seeded: ${nCards} cards, ${nBenefits} benefits, ${nRewards} reward rates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

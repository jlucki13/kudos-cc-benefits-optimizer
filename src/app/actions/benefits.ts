'use server';

/**
 * Benefit-entry server actions: record usage against a period, and undo.
 *
 * Recording resolves the period from the pure engine for the entry's date, so
 * a redemption dated in a past bucket lands in THAT bucket, and each bucket's
 * balance stays independent (the whole point of the tracker).
 */
import { revalidatePath } from 'next/cache';

import { asOfDate } from '@/lib/as-of';
import { parseCivil } from '@/lib/civil';
import { prisma } from '@/lib/db';
import { periodInputFor, snapshotFor } from '@/lib/ensure-periods';
import { periodFor } from '@/lib/periods';
import { LOCAL_USER_ID } from '@/lib/queries';

function refreshApp(): void {
  try {
    revalidatePath('/', 'layout');
  } catch {
    // Outside a Next.js request (tsx script, vitest) there is nothing to revalidate.
  }
}

function assertPositiveInt(value: number, field: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value) || value <= 0) {
    throw new Error(`Invalid ${field}: expected a positive integer, got ${value}`);
  }
}

export interface RecordRedemptionOptions {
  /** Integer cents. Required for statement credits and spend thresholds. */
  amountCents?: number;
  /** Integer points, for POINTS_GRANT benefits. Defaults to the full grant. */
  amountPoints?: number;
  /** 'YYYY-MM-DD'; defaults to today (asOfDate). Decides which period the entry lands in. */
  occurredAt?: string;
  note?: string;
}

/**
 * Record usage against the benefit's period containing `occurredAt ?? today`.
 * Entry kind derives from the benefit type:
 *   STATEMENT_CREDIT → REDEEM (amountCents)
 *   SPEND_THRESHOLD  → SPEND  (amountCents)
 *   POINTS_GRANT     → GRANT  (amountPoints)
 * Creates the BenefitPeriod on the fly when it is not materialized yet.
 */
export async function recordRedemption(
  userCardBenefitId: string,
  opts: RecordRedemptionOptions,
): Promise<{ benefitPeriodId: string; entryId: string }> {
  if (typeof userCardBenefitId !== 'string' || userCardBenefitId.length === 0) {
    throw new Error('userCardBenefitId is required');
  }

  const ucb = await prisma.userCardBenefit.findUnique({
    where: { id: userCardBenefitId },
    include: { benefit: true, userCard: true },
  });
  if (!ucb || ucb.userCard.userId !== LOCAL_USER_ID || ucb.userCard.removedAt) {
    throw new Error('Benefit not found');
  }
  const benefit = ucb.benefit;
  if (benefit.type === 'PERK') {
    throw new Error('Perks have no amount to record');
  }

  const occurredAt = opts.occurredAt ?? asOfDate();
  try {
    parseCivil(occurredAt);
  } catch {
    throw new Error(`Invalid occurredAt: expected 'YYYY-MM-DD', got "${occurredAt}"`);
  }

  let amountCents: number | null = null;
  let amountPoints: number | null = null;
  let kind: 'REDEEM' | 'SPEND' | 'GRANT';
  if (benefit.type === 'POINTS_GRANT') {
    kind = 'GRANT';
    const points = opts.amountPoints ?? benefit.valuePoints;
    if (points == null) throw new Error('amountPoints is required for a points grant');
    assertPositiveInt(points, 'amountPoints');
    amountPoints = points;
  } else {
    kind = benefit.type === 'STATEMENT_CREDIT' ? 'REDEEM' : 'SPEND';
    if (opts.amountCents == null) throw new Error('amountCents is required');
    assertPositiveInt(opts.amountCents, 'amountCents');
    amountCents = opts.amountCents;
  }

  // Resolve the period containing occurredAt from the same engine the reads use.
  const input = periodInputFor(benefit, ucb, ucb.userCard);
  const period = periodFor(input, occurredAt);
  if (!period) {
    throw new Error(`No ${benefit.slug} benefit period covers ${occurredAt}`);
  }

  const periodRow = await prisma.benefitPeriod.upsert({
    where: {
      userCardBenefitId_periodStart: { userCardBenefitId: ucb.id, periodStart: period.start },
    },
    update: {}, // existing snapshots stay frozen
    create: {
      userCardBenefitId: ucb.id,
      periodStart: period.start,
      periodEnd: period.end,
      label: period.label,
      ...snapshotFor(benefit, ucb),
    },
  });

  const entry = await prisma.benefitEntry.create({
    data: {
      benefitPeriodId: periodRow.id,
      kind,
      amountCents,
      amountPoints,
      occurredAt,
      note: opts.note ?? null,
      source: 'MANUAL',
    },
  });

  refreshApp();
  return { benefitPeriodId: periodRow.id, entryId: entry.id };
}

/**
 * Delete the most recent entry in a period. Manual tracking needs an undo —
 * without it a mis-tap permanently corrupts the number.
 */
export async function undoLastEntry(
  benefitPeriodId: string,
): Promise<{ deletedEntryId: string | null }> {
  if (typeof benefitPeriodId !== 'string' || benefitPeriodId.length === 0) {
    throw new Error('benefitPeriodId is required');
  }
  const period = await prisma.benefitPeriod.findUnique({
    where: { id: benefitPeriodId },
    include: {
      userCardBenefit: { include: { userCard: { select: { userId: true } } } },
      entries: { orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 1 },
    },
  });
  if (!period || period.userCardBenefit.userCard.userId !== LOCAL_USER_ID) {
    throw new Error('Period not found');
  }
  const last = period.entries[0];
  if (!last) return { deletedEntryId: null };

  await prisma.benefitEntry.delete({ where: { id: last.id } });
  refreshApp();
  return { deletedEntryId: last.id };
}

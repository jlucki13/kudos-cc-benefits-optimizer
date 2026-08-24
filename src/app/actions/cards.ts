'use server';

/**
 * Card-level server actions for the single local user.
 *
 * Every mutation validates its inputs, writes, then revalidates the whole
 * layout — the wallet appears on all four screens, so partial revalidation
 * would leave stale rollups somewhere.
 */
import { revalidatePath } from 'next/cache';

import { asOfDate } from '@/lib/as-of';
import { parseCivil } from '@/lib/civil';
import { prisma } from '@/lib/db';
import { ensurePeriods } from '@/lib/ensure-periods';
import { LOCAL_USER_ID } from '@/lib/queries';

/** revalidatePath needs a Next request context; scripts and tests run without one. */
function refreshApp(): void {
  try {
    revalidatePath('/', 'layout');
  } catch {
    // Outside a Next.js request (tsx script, vitest) there is nothing to revalidate.
  }
}

function assertCivilDate(value: string, field: string): void {
  try {
    parseCivil(value);
  } catch {
    throw new Error(`Invalid ${field}: expected 'YYYY-MM-DD', got "${value}"`);
  }
}

function assertStatementDay(value: number): void {
  if (!Number.isInteger(value) || value < 1 || value > 31) {
    throw new Error(`Invalid statementDayOfMonth: expected an integer 1-31, got ${value}`);
  }
}

export interface AddCardOptions {
  openedAt?: string;
  statementDayOfMonth?: number;
  last4?: string;
}

/**
 * Add a catalog card to the wallet, with a UserCardBenefit row for every
 * non-retired benefit on the product. Idempotent per product: adding a card
 * already in the wallet returns the existing one instead of duplicating it.
 */
export async function addCard(
  cardProductSlug: string,
  opts: AddCardOptions = {},
): Promise<{ userCardId: string }> {
  if (typeof cardProductSlug !== 'string' || cardProductSlug.length === 0) {
    throw new Error('cardProductSlug is required');
  }
  if (opts.openedAt !== undefined) assertCivilDate(opts.openedAt, 'openedAt');
  if (opts.statementDayOfMonth !== undefined) assertStatementDay(opts.statementDayOfMonth);
  if (opts.last4 !== undefined && !/^\d{4}$/.test(opts.last4)) {
    throw new Error(`Invalid last4: expected exactly four digits, got "${opts.last4}"`);
  }

  const product = await prisma.cardProduct.findUnique({
    where: { slug: cardProductSlug },
    include: { benefits: { where: { retiredAt: null }, select: { slug: true } } },
  });
  if (!product || product.retiredAt) {
    throw new Error(`Unknown card product "${cardProductSlug}"`);
  }

  // The seed creates the local user, but never depend on seed order.
  await prisma.user.upsert({ where: { id: LOCAL_USER_ID }, update: {}, create: { id: LOCAL_USER_ID } });

  const existing = await prisma.userCard.findFirst({
    where: { userId: LOCAL_USER_ID, cardProductSlug, removedAt: null },
    select: { id: true },
  });
  if (existing) {
    refreshApp();
    return { userCardId: existing.id };
  }

  const maxSort = await prisma.userCard.aggregate({
    where: { userId: LOCAL_USER_ID },
    _max: { sortOrder: true },
  });

  const card = await prisma.userCard.create({
    data: {
      userId: LOCAL_USER_ID,
      cardProductSlug,
      openedAt: opts.openedAt ?? null,
      statementDayOfMonth: opts.statementDayOfMonth ?? null,
      last4: opts.last4 ?? null,
      sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
    },
  });
  await prisma.userCardBenefit.createMany({
    data: product.benefits.map((b) => ({ userCardId: card.id, benefitSlug: b.slug })),
  });

  await ensurePeriods(card.id, asOfDate());
  refreshApp();
  return { userCardId: card.id };
}

/**
 * Soft-delete: sets removedAt, never deletes. Entries are the user's history;
 * a hard delete would silently rewrite past ROI.
 */
export async function removeCard(userCardId: string): Promise<void> {
  if (typeof userCardId !== 'string' || userCardId.length === 0) {
    throw new Error('userCardId is required');
  }
  await prisma.userCard.updateMany({
    where: { id: userCardId, userId: LOCAL_USER_ID, removedAt: null },
    data: { removedAt: asOfDate() },
  });
  refreshApp();
}

export interface CardDates {
  openedAt?: string | null;
  statementDayOfMonth?: number | null;
}

/** Update the anchor dates that drive anniversary-based benefit years. */
export async function setCardDates(userCardId: string, dates: CardDates): Promise<void> {
  if (typeof userCardId !== 'string' || userCardId.length === 0) {
    throw new Error('userCardId is required');
  }
  const data: { openedAt?: string | null; statementDayOfMonth?: number | null } = {};
  if ('openedAt' in dates && dates.openedAt !== undefined) {
    if (dates.openedAt !== null) assertCivilDate(dates.openedAt, 'openedAt');
    data.openedAt = dates.openedAt;
  }
  if ('statementDayOfMonth' in dates && dates.statementDayOfMonth !== undefined) {
    if (dates.statementDayOfMonth !== null) assertStatementDay(dates.statementDayOfMonth);
    data.statementDayOfMonth = dates.statementDayOfMonth;
  }
  if (Object.keys(data).length === 0) return;

  const result = await prisma.userCard.updateMany({
    where: { id: userCardId, userId: LOCAL_USER_ID, removedAt: null },
    data,
  });
  if (result.count === 0) throw new Error('Card not found');

  // New anchors mean new period boundaries — materialize them right away.
  await ensurePeriods(userCardId, asOfDate());
  refreshApp();
}

const REDEMPTION_METHODS = new Set(['DEFAULT', 'CASH_BACK', 'TRAVEL_PORTAL', 'TRANSFER_PARTNERS']);

/** Choose how points convert to dollars for one currency (wallet-wide, not per-card). */
export async function setRedemptionMethod(
  currencySlug: string,
  method: 'DEFAULT' | 'CASH_BACK' | 'TRAVEL_PORTAL' | 'TRANSFER_PARTNERS',
): Promise<void> {
  if (typeof currencySlug !== 'string' || currencySlug.length === 0) {
    throw new Error('currencySlug is required');
  }
  if (!REDEMPTION_METHODS.has(method)) {
    throw new Error(`Invalid redemption method "${method}"`);
  }
  const currency = await prisma.pointsCurrency.findUnique({ where: { slug: currencySlug } });
  if (!currency) throw new Error(`Unknown points currency "${currencySlug}"`);

  await prisma.user.upsert({ where: { id: LOCAL_USER_ID }, update: {}, create: { id: LOCAL_USER_ID } });
  await prisma.userPointsPreference.upsert({
    where: { userId_currencySlug: { userId: LOCAL_USER_ID, currencySlug } },
    update: { method },
    create: { userId: LOCAL_USER_ID, currencySlug, method },
  });
  refreshApp();
}

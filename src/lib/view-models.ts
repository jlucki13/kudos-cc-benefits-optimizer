/**
 * View models: the contract between the data layer and the UI.
 *
 * Screens render these and nothing else — no Prisma types reach a component.
 * That keeps presentational work testable against fixtures and lets the query
 * layer change shape without touching the UI.
 *
 * All money is integer cents. Anything ending in `Label` is preformatted for
 * display, because formatting rules (a null FX fee renders "None", not "0%")
 * belong with the data, not scattered through components.
 */
import type { CardArtSpec } from '@/catalog/types';

export type BenefitKind = 'STATEMENT_CREDIT' | 'POINTS_GRANT' | 'SPEND_THRESHOLD' | 'PERK';
export type PeriodStatus = 'open' | 'closed' | 'future';

export interface RewardRateVM {
  multiplierLabel: string; // "8x"
  category: string; // "at Chase Ultimate Rewards (Rental Cars, Hotels, Dining)"
  description: string;
  endsOn?: string;
}

export interface BenefitPeriodVM {
  id: string | null; // null until the period is materialized by a first entry
  start: string; // 'YYYY-MM-DD' inclusive
  end: string; // 'YYYY-MM-DD' EXCLUSIVE
  label: string; // "Jan–Jun 2026"
  status: PeriodStatus;
  /** Face value of this period. Null for PERK. */
  valueCents: number | null;
  usedCents: number;
  remainingCents: number;
  /** 0-100, clamped. Drives the progress bar. */
  percentUsed: number;
  /** Negative once the period has closed. */
  daysLeft: number;
}

export interface BenefitVM {
  slug: string;
  kind: BenefitKind;
  title: string;
  shortTitle: string;
  description: string;
  brandKey?: string;
  /** "$300 per year", "$150 twice a year • $300 total", "$15 per month" */
  cadenceLabel: string;
  isHighlighted: boolean;
  registerByDate?: string;
  /** Null for PERK, and for any benefit outside its fixed window. */
  currentPeriod: BenefitPeriodVM | null;
}

export interface RollupVM {
  capturedCents: number;
  addressableToDateCents: number;
  claimableNowCents: number;
  forfeitedCents: number;
  unopenedCents: number;
  annualFaceValueCents: number;
}

export interface CardRoiVM extends RollupVM {
  annualFeeCents: number;
  /** captured - fee. Negative means underwater today. */
  netCents: number;
  /** captured + claimableNow - fee: where you land if you use what's still open. */
  projectedNetCents: number;
  isWorthItToday: boolean;
}

export interface CardVM {
  userCardId: string;
  slug: string;
  name: string; // "Chase Sapphire Reserve®"
  shortName: string;
  issuerDisplayName: string; // "Chase"
  issuerBrandColor: string;
  network: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  last4: string | null;
  art: CardArtSpec;

  annualFeeLabel: string; // "$795"
  aprLabel: string; // "19.49% - 27.99%"
  foreignTxFeeLabel: string; // "None"
  dataAsOf: string;
  sourceUrl: string;

  pointsCurrencyName: string | null; // "Chase Ultimate Rewards"
  redemptionMethod: 'DEFAULT' | 'CASH_BACK' | 'TRAVEL_PORTAL' | 'TRANSFER_PARTNERS';
  centsPerPointLabel: string | null; // "1.5¢ per point"

  rewards: RewardRateVM[];
  /** STATEMENT_CREDIT + POINTS_GRANT — the trackable, dollar-valued ones. */
  redeemable: BenefitVM[];
  /** SPEND_THRESHOLD + PERK — shown, never counted as dollars. */
  other: BenefitVM[];
  roi: CardRoiVM;
}

/** A benefit lifted out of its card, for the wallet-wide tracker. */
export interface TrackerItemVM extends BenefitVM {
  userCardId: string;
  cardShortName: string;
  cardArt: CardArtSpec;
}

export type TrackerGroup = 'expiring' | 'available' | 'used' | 'missed' | 'untracked';

export interface TrackerVM {
  groups: { key: TrackerGroup; label: string; items: TrackerItemVM[] }[];
  totals: RollupVM;
}

export interface CatalogEntryVM {
  slug: string;
  name: string;
  shortName: string;
  issuerDisplayName: string;
  network: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  annualFeeLabel: string;
  art: CardArtSpec;
  benefitCount: number;
  alreadyInWallet: boolean;
}

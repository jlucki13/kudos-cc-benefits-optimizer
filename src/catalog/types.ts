export type CivilDate = string; // 'YYYY-MM-DD'

export interface CardArtSpec {
  gradient: [string, string, ...string[]];
  pattern: 'guilloche' | 'sheen' | 'dots' | 'plain';
  textColor: string;
  chipColor: string;
}

interface SeedBenefitBase {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  brandKey?: string;
  cadence: 'MONTHLY'|'QUARTERLY'|'SEMIANNUAL'|'ANNUAL'|'EVERY_N_YEARS'|'ONE_TIME'|'NONE';
  resetBasis: 'CALENDAR'|'ANNIVERSARY'|'STATEMENT_ANNIVERSARY'|'FIXED_WINDOW';
  isHighlighted?: boolean;
  windowStart?: CivilDate;
  windowEnd?: CivilDate;
  registerByDate?: CivilDate;
}

export type SeedBenefit =
  | (SeedBenefitBase & { type: 'STATEMENT_CREDIT'; valueCents: number })
  | (SeedBenefitBase & { type: 'POINTS_GRANT'; valuePoints: number })
  | (SeedBenefitBase & { type: 'SPEND_THRESHOLD'; thresholdCents: number })
  | (SeedBenefitBase & { type: 'PERK'; everyNYears?: number });

export interface SeedRewardRate {
  multiplierX100: number;
  category: string;
  description: string;
  endsOn?: CivilDate;
}

export interface SeedCard {
  slug: string;
  issuer: string;
  name: string;
  shortName: string;
  network: 'VISA'|'MASTERCARD'|'AMEX'|'DISCOVER';
  annualFeeCents: number;
  aprLowBps: number;
  aprHighBps: number;
  foreignTxFeeBps: number | null;
  pointsCurrency?: string;
  art: CardArtSpec;
  dataAsOf: CivilDate;
  sourceUrl: string;
  rewards: SeedRewardRate[];
  benefits: SeedBenefit[];
}

export interface SeedIssuer { slug: string; name: string; displayName: string; brandColor: string; }
export interface SeedPointsValuation { method: 'DEFAULT'|'CASH_BACK'|'TRAVEL_PORTAL'|'TRANSFER_PARTNERS'; milliCentsPerPoint: number; label: string; notes?: string; }
export interface SeedPointsCurrency { slug: string; name: string; shortName: string; valuations: SeedPointsValuation[]; }

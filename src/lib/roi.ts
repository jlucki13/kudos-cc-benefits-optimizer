/**
 * roi.ts — ROI rollups over mixed cadences.
 *
 * Works on already-materialized PeriodFacts (one per period, with face value
 * and usage), so a $15/month credit contributes 12 monthly facts and a $200
 * annual credit contributes 1 — and the rollup deliberately does NOT treat
 * them alike: monthly value accrues in slices (and is forfeited slice by
 * slice), while annual value is fully at risk from day one.
 *
 * Period ends are EXCLUSIVE, matching periods.ts:
 *   opened: start <= asOf     (the bucket that starts today HAS opened)
 *   open:   start <= asOf < end
 *   closed: end <= asOf
 */

import { type CivilDate, compareCivil } from './civil';

export { pointsToCents } from './money';

export interface PeriodFact {
  start: CivilDate;
  end: CivilDate; // EXCLUSIVE
  valueCents: number; // face value of THIS period
  usedCents: number; // sum of entries in this period
}

export interface Rollup {
  capturedCents: number; // actually used — banked
  addressableToDateCents: number; // face value of periods that have OPENED by asOf
  claimableNowCents: number; // open periods, unused remainder — act now
  forfeitedCents: number; // CLOSED periods, unused remainder — permanently lost
  unopenedCents: number; // periods not yet opened this benefit year
  annualFaceValueCents: number; // full-year face value (the marketing number)
}

export function emptyRollup(): Rollup {
  return {
    capturedCents: 0,
    addressableToDateCents: 0,
    claimableNowCents: 0,
    forfeitedCents: 0,
    unopenedCents: 0,
    annualFaceValueCents: 0,
  };
}

/** Classify every period against asOf and accumulate. Invariant: addressable + unopened === annualFaceValue. */
export function rollup(periods: PeriodFact[], asOf: CivilDate): Rollup {
  const r = emptyRollup();
  for (const p of periods) {
    r.annualFaceValueCents += p.valueCents;
    r.capturedCents += p.usedCents;
    const opened = compareCivil(p.start, asOf) <= 0; // start <= asOf
    const closed = compareCivil(p.end, asOf) <= 0; // end <= asOf
    if (opened) r.addressableToDateCents += p.valueCents;
    else r.unopenedCents += p.valueCents;
    const remainder = Math.max(0, p.valueCents - p.usedCents);
    if (closed) r.forfeitedCents += remainder;
    else if (opened) r.claimableNowCents += remainder;
  }
  return r;
}

/** Field-wise sum across benefits/cards. rollupMany([]) is all zeros. */
export function rollupMany(rollups: Rollup[]): Rollup {
  const r = emptyRollup();
  for (const x of rollups) {
    r.capturedCents += x.capturedCents;
    r.addressableToDateCents += x.addressableToDateCents;
    r.claimableNowCents += x.claimableNowCents;
    r.forfeitedCents += x.forfeitedCents;
    r.unopenedCents += x.unopenedCents;
    r.annualFaceValueCents += x.annualFaceValueCents;
  }
  return r;
}

/** Has the card paid for itself? captured >= fee. */
export function isFeeWorthIt(capturedCents: number, annualFeeCents: number): boolean {
  return capturedCents >= annualFeeCents;
}

/** What the year looks like if every currently-open remainder gets claimed. */
export function projectedCents(r: Rollup): number {
  return r.capturedCents + r.claimableNowCents;
}

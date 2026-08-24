/**
 * periods.ts — the benefit-period engine.
 *
 * Two-stage algorithm, always:
 *   Stage 1: find the BENEFIT YEAR [yStart, yEnd) from the reset basis.
 *   Stage 2: subdivide that year into cadence buckets with addMonthsClamped
 *            and select the bucket containing asOf.
 *
 * Because the stages compose, CALENDAR+SEMIANNUAL naturally yields
 * Jan–Jun / Jul–Dec and ANNIVERSARY+SEMIANNUAL yields anniversary-based
 * halves, with no special-casing.
 *
 * All ends are EXCLUSIVE: a period is [start, end).
 */

import {
  type CivilDate,
  addDays,
  addMonthsClamped,
  compareCivil,
  daysInMonth,
  parseCivil,
  toCivil,
} from './civil';

export type Cadence =
  | 'MONTHLY'
  | 'QUARTERLY'
  | 'SEMIANNUAL'
  | 'ANNUAL'
  | 'EVERY_N_YEARS'
  | 'ONE_TIME'
  | 'NONE';

export type ResetBasis = 'CALENDAR' | 'ANNIVERSARY' | 'STATEMENT_ANNIVERSARY' | 'FIXED_WINDOW';

export interface PeriodInput {
  cadence: Cadence;
  basis: ResetBasis;
  openedAt?: CivilDate | null;
  statementDayOfMonth?: number | null;
  windowStart?: CivilDate | null;
  windowEnd?: CivilDate | null;
  everyNYears?: number | null;
}

export interface Period {
  start: CivilDate; // inclusive
  end: CivilDate; // EXCLUSIVE
  index: number; // 0-based within the benefit year
  label: string; // "Jan–Jun 2026", "Mar 2026", "2026 Cardmember Year"
}

/** Sentinel for an unbounded ONE_TIME period ("never expires"). Sorts after every real date. */
export const MAX_CIVIL: CivilDate = '9999-12-31';
/** Sentinel lower bound (used when a ONE_TIME benefit has no anchor at all). */
export const MIN_CIVIL: CivilDate = '0001-01-01';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function monthName(m: number): string {
  return MONTH_ABBR[m - 1] ?? '???';
}

/**
 * Human label for [start, end). Displays the INCLUSIVE last day (end - 1):
 *   [2026-01-01, 2027-01-01) → "2026"
 *   [2026-03-01, 2026-04-01) → "Mar 2026"
 *   [2026-01-01, 2026-07-01) → "Jan–Jun 2026"
 *   [2025-11-01, 2026-05-01) → "Nov 2025 – Apr 2026"
 *   [2025-12-17, 2026-01-17) → "Dec 17, 2025 – Jan 16, 2026"
 */
function labelRange(start: CivilDate, endExclusive: CivilDate): string {
  const s = parseCivil(start);
  const endP = parseCivil(endExclusive);
  const last = parseCivil(addDays(endExclusive, -1));
  const monthAligned = s.d === 1 && endP.d === 1;
  if (monthAligned) {
    if (s.y === last.y && s.m === 1 && last.m === 12) return String(s.y);
    if (s.y === last.y && s.m === last.m) return `${monthName(s.m)} ${s.y}`;
    if (s.y === last.y) return `${monthName(s.m)}–${monthName(last.m)} ${s.y}`;
    return `${monthName(s.m)} ${s.y} – ${monthName(last.m)} ${last.y}`;
  }
  if (s.y === last.y) return `${monthName(s.m)} ${s.d} – ${monthName(last.m)} ${last.d}, ${s.y}`;
  return `${monthName(s.m)} ${s.d}, ${s.y} – ${monthName(last.m)} ${last.d}, ${last.y}`;
}

function mk(start: CivilDate, end: CivilDate, index: number, label: string): Period {
  return { start, end, index, label };
}

// ---------------------------------------------------------------------------
// Stage 1 helpers
// ---------------------------------------------------------------------------

function validStatementDay(s: number | null | undefined): s is number {
  return typeof s === 'number' && Number.isInteger(s) && s >= 1 && s <= 31;
}

/**
 * Largest k >= 0 such that the k-th anniversary of openedAt
 * (addMonthsClamped(openedAt, 12k)) is at or before asOf.
 * Returns null when asOf precedes openedAt entirely.
 * Anniversaries are always computed FROM openedAt (never chained), so a
 * Feb 29 opening yields Feb 28 anniversaries in common years and recovers
 * Feb 29 in leap years.
 */
function anniversaryIndexAtOrBefore(openedAt: CivilDate, asOf: CivilDate): number | null {
  if (compareCivil(asOf, openedAt) < 0) return null;
  let k = parseCivil(asOf).y - parseCivil(openedAt).y;
  while (k > 0 && compareCivil(addMonthsClamped(openedAt, 12 * k), asOf) > 0) k--;
  return k;
}

/**
 * First date with day-of-month S STRICTLY AFTER anniversary A:
 * same month if S > A.day, otherwise the next month — clamped to that month's
 * length. When clamping pulls the same-month candidate back to <= A (e.g.
 * A = Apr 30 with S = 31 clamps to Apr 30 == A), "strictly after" wins and the
 * open moves to the next month.
 */
function statementOpen(anniversary: CivilDate, s: number): CivilDate {
  const a = parseCivil(anniversary);
  if (s > a.d) {
    const cand = toCivil(a.y, a.m, Math.min(s, daysInMonth(a.y, a.m)));
    if (compareCivil(cand, anniversary) > 0) return cand;
  }
  const ny = a.m === 12 ? a.y + 1 : a.y;
  const nm = a.m === 12 ? 1 : a.m + 1;
  return toCivil(ny, nm, Math.min(s, daysInMonth(ny, nm)));
}

function calendarYearOf(asOf: CivilDate): Period {
  const y = parseCivil(asOf).y;
  return mk(toCivil(y, 1, 1), toCivil(y + 1, 1, 1), 0, String(y));
}

function cardmemberLabel(yStart: CivilDate): string {
  return `${parseCivil(yStart).y} Cardmember Year`;
}

/** Stage 1 for the recurring cadences (MONTHLY/QUARTERLY/SEMIANNUAL/ANNUAL). */
function standardBenefitYear(i: PeriodInput, asOf: CivilDate): Period | null {
  let basis = i.basis;
  // Graceful degradation, exactly as specced:
  //   STATEMENT_ANNIVERSARY without a usable statement day → ANNIVERSARY
  //   ANNIVERSARY (or the above) without openedAt → CALENDAR
  if (basis === 'STATEMENT_ANNIVERSARY' && !validStatementDay(i.statementDayOfMonth)) {
    basis = 'ANNIVERSARY';
  }
  if ((basis === 'ANNIVERSARY' || basis === 'STATEMENT_ANNIVERSARY') && !i.openedAt) {
    basis = 'CALENDAR';
  }

  switch (basis) {
    case 'CALENDAR':
      return calendarYearOf(asOf);

    case 'ANNIVERSARY': {
      const openedAt = i.openedAt as CivilDate;
      const k = anniversaryIndexAtOrBefore(openedAt, asOf);
      if (k === null) return null; // asOf predates the card
      const start = addMonthsClamped(openedAt, 12 * k);
      const end = addMonthsClamped(openedAt, 12 * (k + 1));
      return mk(start, end, 0, cardmemberLabel(start));
    }

    case 'STATEMENT_ANNIVERSARY': {
      const openedAt = i.openedAt as CivilDate;
      const s = i.statementDayOfMonth as number;
      const k0 = anniversaryIndexAtOrBefore(openedAt, asOf);
      if (k0 === null) return null;
      const openFor = (k: number): CivilDate => statementOpen(addMonthsClamped(openedAt, 12 * k), s);
      // The year anchored at anniversary k0 opens at openFor(k0); if asOf falls
      // between the anniversary and that open, we are still in the previous year.
      let start: CivilDate;
      let end: CivilDate;
      if (compareCivil(openFor(k0), asOf) <= 0) {
        start = openFor(k0);
        end = openFor(k0 + 1);
      } else {
        start = openFor(k0 - 1);
        end = openFor(k0);
      }
      return mk(start, end, 0, cardmemberLabel(start));
    }

    case 'FIXED_WINDOW': {
      if (!i.windowStart || !i.windowEnd) return null;
      if (compareCivil(asOf, i.windowStart) < 0 || compareCivil(asOf, i.windowEnd) >= 0) return null;
      return mk(i.windowStart, i.windowEnd, 0, labelRange(i.windowStart, i.windowEnd));
    }
  }
}

/** ONE_TIME: a single period from the anchor with no recurrence. */
function oneTimePeriod(i: PeriodInput, asOf: CivilDate): Period | null {
  const windowed = i.basis === 'FIXED_WINDOW' || (i.windowStart != null && i.windowEnd != null);
  if (windowed) {
    if (!i.windowStart || !i.windowEnd) return null;
    if (compareCivil(asOf, i.windowStart) < 0 || compareCivil(asOf, i.windowEnd) >= 0) return null;
    return mk(i.windowStart, i.windowEnd, 0, labelRange(i.windowStart, i.windowEnd));
  }
  // No expiry was specified anywhere, so the period is open-ended.
  const anchor = i.openedAt ?? MIN_CIVIL;
  if (compareCivil(asOf, anchor) < 0) return null;
  return mk(anchor, MAX_CIVIL, 0, 'One-time');
}

/** EVERY_N_YEARS: a year-length window recurring every everyNYears years from openedAt. */
function everyNYearsPeriod(i: PeriodInput, asOf: CivilDate): Period | null {
  const n = typeof i.everyNYears === 'number' && i.everyNYears >= 1 ? Math.floor(i.everyNYears) : 1;
  const anchor = i.openedAt ?? i.windowStart ?? null;
  if (!anchor) return calendarYearOf(asOf); // no phase information — degrade to calendar year
  if (compareCivil(asOf, anchor) < 0) return null;
  let c = Math.floor((parseCivil(asOf).y - parseCivil(anchor).y) / n);
  while (c > 0 && compareCivil(addMonthsClamped(anchor, 12 * n * c), asOf) > 0) c--;
  const start = addMonthsClamped(anchor, 12 * n * c);
  // The window spans the FULL n-year cycle, not just its first year. A Global
  // Entry credit offered "every 4 years" is claimable at any point in the
  // cycle, so consecutive windows tile continuously with no dead gap between.
  const end = addMonthsClamped(anchor, 12 * n * (c + 1));
  return mk(start, end, 0, labelRange(start, end));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Stage 1: the benefit year (or standalone window) containing asOf, else null. */
export function benefitYearFor(i: PeriodInput, asOf: CivilDate): Period | null {
  switch (i.cadence) {
    case 'NONE':
      return null; // perks have no periods
    case 'ONE_TIME':
      return oneTimePeriod(i, asOf);
    case 'EVERY_N_YEARS':
      return everyNYearsPeriod(i, asOf);
    default:
      return standardBenefitYear(i, asOf);
  }
}

function bucketsPerYear(c: Cadence): number {
  switch (c) {
    case 'MONTHLY':
      return 12;
    case 'QUARTERLY':
      return 4;
    case 'SEMIANNUAL':
      return 2;
    default:
      return 1; // ANNUAL; ONE_TIME and EVERY_N_YEARS are already single windows
  }
}

/**
 * Stage 2: all cadence buckets of the benefit year containing asOf.
 * Bucket k spans [addMonthsClamped(yStart, k*step), addMonthsClamped(yStart, (k+1)*step)).
 * Invariant: buckets tile [yStart, yEnd) exactly — the final bucket's end is
 * snapped to yEnd (they can differ by a day when a Feb-29 anchor makes the
 * year end recover Feb 29 while the chained boundary stops at Feb 28), and any
 * boundary past yEnd (short FIXED_WINDOWs) is capped.
 */
export function periodsInYear(i: PeriodInput, asOf: CivilDate): Period[] {
  const year = benefitYearFor(i, asOf);
  if (!year) return [];
  const n = bucketsPerYear(i.cadence);
  if (n === 1) return [year];
  const step = 12 / n;
  const out: Period[] = [];
  for (let k = 0; k < n; k++) {
    const start = k === 0 ? year.start : addMonthsClamped(year.start, k * step);
    let end = k === n - 1 ? year.end : addMonthsClamped(year.start, (k + 1) * step);
    if (compareCivil(start, year.end) >= 0) break; // window shorter than the cadence grid
    if (compareCivil(end, year.end) > 0) end = year.end;
    out.push(mk(start, end, out.length, labelRange(start, end)));
  }
  return out;
}

/**
 * The single period containing asOf, or null (NONE; outside a FIXED_WINDOW or
 * EVERY_N_YEARS window; before a ONE_TIME anchor; before openedAt).
 * Ends are exclusive, so asOf exactly equal to a period's end lands in the
 * NEXT period.
 */
export function periodFor(i: PeriodInput, asOf: CivilDate): Period | null {
  for (const p of periodsInYear(i, asOf)) {
    if (compareCivil(p.start, asOf) <= 0 && compareCivil(asOf, p.end) < 0) return p;
  }
  return null;
}

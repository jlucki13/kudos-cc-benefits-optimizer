import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonthsClamped,
  compareCivil,
  daysInMonth,
  diffDays,
  isLeapYear,
  parseCivil,
  toCivil,
} from '@/lib/civil';
import { MAX_CIVIL, benefitYearFor, periodFor, periodsInYear } from '@/lib/periods';
import type { Period, PeriodInput } from '@/lib/periods';

function input(over: Partial<PeriodInput>): PeriodInput {
  return { cadence: 'ANNUAL', basis: 'CALENDAR', ...over };
}

/** Buckets must exactly tile [start, end) with contiguous exclusive ends and 0-based indices. */
function expectTiling(ps: Period[], start: string, end: string): void {
  expect(ps.length).toBeGreaterThan(0);
  expect(ps[0]!.start).toBe(start);
  expect(ps[ps.length - 1]!.end).toBe(end);
  for (let i = 1; i < ps.length; i++) expect(ps[i]!.start).toBe(ps[i - 1]!.end);
  ps.forEach((p, i) => {
    expect(p.index).toBe(i);
    expect(compareCivil(p.start, p.end)).toBe(-1);
  });
}

// ---------------------------------------------------------------------------
// civil.ts primitives
// ---------------------------------------------------------------------------

describe('civil: parse/format', () => {
  it('round-trips zero-padded dates', () => {
    expect(toCivil(2026, 3, 5)).toBe('2026-03-05');
    expect(parseCivil('2026-03-05')).toEqual({ y: 2026, m: 3, d: 5 });
    expect(toCivil(476, 12, 31)).toBe('0476-12-31');
  });

  it('rejects malformed or impossible dates', () => {
    expect(() => parseCivil('2026-3-5')).toThrow(); // not zero-padded
    expect(() => parseCivil('2026-02-30')).toThrow(); // no Feb 30
    expect(() => parseCivil('2026-13-01')).toThrow();
    expect(() => parseCivil('garbage')).toThrow();
  });
});

describe('civil: daysInMonth implements the real leap rule', () => {
  it('handles century years: 1900 is NOT a leap year, 2000 is', () => {
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });

  it('handles ordinary years and month lengths', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2025, 2)).toBe(28);
    expect(daysInMonth(2026, 4)).toBe(30);
    expect(daysInMonth(2026, 12)).toBe(31);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(2400)).toBe(true);
  });
});

describe('civil: addMonthsClamped', () => {
  it('clamps Jan 31 into February (leap-aware) — never rolls into March', () => {
    expect(addMonthsClamped('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonthsClamped('2024-01-31', 1)).toBe('2024-02-29');
  });

  it('clamps May 31 + 1 month to Jun 30', () => {
    expect(addMonthsClamped('2026-05-31', 1)).toBe('2026-06-30');
  });

  it('recovers the original day past short months (adds from the anchor, not chained)', () => {
    expect(addMonthsClamped('2026-01-31', 2)).toBe('2026-03-31');
    expect(addMonthsClamped('2024-11-30', 3)).toBe('2025-02-28');
  });

  it('handles Feb 29 anchors across years', () => {
    expect(addMonthsClamped('2024-02-29', 12)).toBe('2025-02-28');
    expect(addMonthsClamped('2024-02-29', 48)).toBe('2028-02-29');
  });

  it('handles negative and zero offsets and year rollover', () => {
    expect(addMonthsClamped('2026-03-31', -1)).toBe('2026-02-28');
    expect(addMonthsClamped('2026-01-15', 0)).toBe('2026-01-15');
    expect(addMonthsClamped('2025-12-31', 1)).toBe('2026-01-31');
    expect(addMonthsClamped('2026-01-01', -13)).toBe('2024-12-01');
  });
});

describe('civil: addDays / diffDays / compareCivil (no Date objects)', () => {
  it('addDays crosses month, leap-day, and year boundaries', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDays('2024-02-29', 1)).toBe('2024-03-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addDays('2026-01-01', 365)).toBe('2027-01-01');
    expect(addDays('2024-01-01', 366)).toBe('2025-01-01');
  });

  it('diffDays is b - a and leap/century aware', () => {
    expect(diffDays('2026-01-01', '2026-03-01')).toBe(59);
    expect(diffDays('2024-01-01', '2025-01-01')).toBe(366);
    expect(diffDays('2026-03-01', '2026-01-01')).toBe(-59);
    expect(diffDays('2026-08-24', '2026-08-24')).toBe(0);
    expect(diffDays('1900-02-28', '1900-03-01')).toBe(1); // 1900 is not a leap year
    expect(diffDays('2000-02-28', '2000-03-01')).toBe(2); // 2000 is
  });

  it('compareCivil orders lexicographically = chronologically', () => {
    expect(compareCivil('2026-01-31', '2026-02-01')).toBe(-1);
    expect(compareCivil('2026-02-01', '2026-01-31')).toBe(1);
    expect(compareCivil('2026-02-01', '2026-02-01')).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Stage 1: benefit years
// ---------------------------------------------------------------------------

describe('stage 1: CALENDAR benefit year', () => {
  it('is [Jan 1 Y, Jan 1 Y+1)', () => {
    const y = benefitYearFor(input({ cadence: 'MONTHLY', basis: 'CALENDAR' }), '2026-08-24');
    expect(y).toEqual({ start: '2026-01-01', end: '2027-01-01', index: 0, label: '2026' });
  });
});

describe('stage 1: ANNIVERSARY benefit year', () => {
  const leapCard = input({ cadence: 'ANNUAL', basis: 'ANNIVERSARY', openedAt: '2024-02-29' });

  it('leap-day opening: the 2026 anniversary is 2026-02-28', () => {
    const y = benefitYearFor(leapCard, '2026-08-24')!;
    expect(y.start).toBe('2026-02-28');
    expect(y.end).toBe('2027-02-28');
    expect(y.label).toBe('2026 Cardmember Year');
  });

  it('the day before the anniversary still belongs to the previous year', () => {
    const y = benefitYearFor(leapCard, '2026-02-27')!;
    expect(y.start).toBe('2025-02-28');
    expect(y.end).toBe('2026-02-28');
  });

  it('the anniversary day itself starts the new year (start inclusive)', () => {
    const y = benefitYearFor(leapCard, '2026-02-28')!;
    expect(y.start).toBe('2026-02-28');
  });

  it('recovers Feb 29 in a later leap year (anniversaries computed from openedAt, not chained)', () => {
    const y = benefitYearFor(leapCard, '2028-06-01')!;
    expect(y.start).toBe('2028-02-29');
    expect(y.end).toBe('2029-02-28');
  });

  it('asOf before openedAt → null', () => {
    expect(benefitYearFor(input({ basis: 'ANNIVERSARY', openedAt: '2026-09-01' }), '2026-08-24')).toBeNull();
  });

  it('missing openedAt degrades to CALENDAR', () => {
    const y = benefitYearFor(input({ cadence: 'MONTHLY', basis: 'ANNIVERSARY', openedAt: null }), '2026-08-24')!;
    expect(y.start).toBe('2026-01-01');
    expect(y.end).toBe('2027-01-01');
  });
});

describe('stage 1: STATEMENT_ANNIVERSARY benefit year', () => {
  it('statement day 31 clamps into February', () => {
    // anniversary 2026-02-10, S=31 → same month, clamped to Feb length → 2026-02-28
    const y = benefitYearFor(
      input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2024-02-10', statementDayOfMonth: 31 }),
      '2026-06-01',
    )!;
    expect(y.start).toBe('2026-02-28');
    expect(y.end).toBe('2027-02-28'); // same computed close one year later
  });

  it('statement day 31 clamps into February of a LEAP year as Feb 29', () => {
    const y = benefitYearFor(
      input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2022-02-10', statementDayOfMonth: 31 }),
      '2024-03-01',
    )!;
    expect(y.start).toBe('2024-02-29');
    expect(y.end).toBe('2025-02-28');
  });

  it('statement day 31 clamps into April (30 days)', () => {
    const y = benefitYearFor(
      input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2024-04-05', statementDayOfMonth: 31 }),
      '2026-06-01',
    )!;
    expect(y.start).toBe('2026-04-30');
    expect(y.end).toBe('2027-04-30');
  });

  it('"strictly after" wins when clamping would land ON the anniversary (Apr 30 + S=31 → May 31)', () => {
    const y = benefitYearFor(
      input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2024-04-30', statementDayOfMonth: 31 }),
      '2026-06-01',
    )!;
    expect(y.start).toBe('2026-05-31');
    expect(y.end).toBe('2027-05-31');
  });

  it('S <= anniversary day pushes into the next month, across December', () => {
    const y = benefitYearFor(
      input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2023-12-20', statementDayOfMonth: 5 }),
      '2026-03-01',
    )!;
    expect(y.start).toBe('2026-01-05');
    expect(y.end).toBe('2027-01-05');
  });

  it('asOf between the anniversary and the statement open stays in the PREVIOUS window', () => {
    const i = input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2019-08-26', statementDayOfMonth: 13 });
    // anniversary 2026-08-26 has passed but the window opens 2026-09-13
    const prev = benefitYearFor(i, '2026-09-01')!;
    expect(prev.start).toBe('2025-09-13');
    expect(prev.end).toBe('2026-09-13');
    // the open day itself starts the new window
    const next = benefitYearFor(i, '2026-09-13')!;
    expect(next.start).toBe('2026-09-13');
    expect(next.end).toBe('2027-09-13');
  });

  it('missing statement day degrades to plain ANNIVERSARY', () => {
    const y = benefitYearFor(
      input({ basis: 'STATEMENT_ANNIVERSARY', openedAt: '2024-03-10', statementDayOfMonth: null }),
      '2026-08-24',
    )!;
    expect(y.start).toBe('2026-03-10');
    expect(y.end).toBe('2027-03-10');
  });
});

describe('stage 1: FIXED_WINDOW', () => {
  const fixed = input({ cadence: 'ANNUAL', basis: 'FIXED_WINDOW', windowStart: '2026-01-01', windowEnd: '2026-07-01' });

  it('returns the window while asOf is inside it', () => {
    const p = periodFor(fixed, '2026-06-30')!;
    expect(p.start).toBe('2026-01-01');
    expect(p.end).toBe('2026-07-01');
  });

  it('returns null before windowStart and at/after windowEnd (end is EXCLUSIVE)', () => {
    expect(periodFor(fixed, '2025-12-31')).toBeNull();
    expect(periodFor(fixed, '2026-07-01')).toBeNull(); // exactly windowEnd → outside
    expect(periodFor(fixed, '2026-08-15')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Stage 2: cadence subdivision (the composition is the point)
// ---------------------------------------------------------------------------

describe('stage 2: CALENDAR + SEMIANNUAL (the two independent $150 buckets)', () => {
  const i = input({ cadence: 'SEMIANNUAL', basis: 'CALENDAR' });

  it('splits the calendar year into Jan–Jun and Jul–Dec with no special-casing', () => {
    const ps = periodsInYear(i, '2026-03-15');
    expect(ps).toHaveLength(2);
    expectTiling(ps, '2026-01-01', '2027-01-01');
    expect(ps[0]!.label).toBe('Jan–Jun 2026');
    expect(ps[1]!.label).toBe('Jul–Dec 2026');
  });

  it('2026-06-30 is in index 0, which ends 2026-07-01 (exclusive end)', () => {
    const p = periodFor(i, '2026-06-30')!;
    expect(p.index).toBe(0);
    expect(p.start).toBe('2026-01-01');
    expect(p.end).toBe('2026-07-01');
  });

  it('2026-07-01 — exactly a periodEnd — lands in the NEXT period (index 1)', () => {
    const p = periodFor(i, '2026-07-01')!;
    expect(p.index).toBe(1);
    expect(p.start).toBe('2026-07-01');
    expect(p.end).toBe('2027-01-01');
  });
});

describe('stage 2: CALENDAR + MONTHLY', () => {
  const i = input({ cadence: 'MONTHLY', basis: 'CALENDAR' });

  it('selects the month bucket with a "Mar 2026"-style label', () => {
    const p = periodFor(i, '2026-03-31')!;
    expect(p).toEqual({ start: '2026-03-01', end: '2026-04-01', index: 2, label: 'Mar 2026' });
  });

  it('asOf equal to a month end lands in the next month', () => {
    const p = periodFor(i, '2026-04-01')!;
    expect(p.index).toBe(3);
    expect(p.start).toBe('2026-04-01');
  });

  it('asOf equal to the benefit-year end rolls into the NEXT year, index 0', () => {
    const p = periodFor(i, '2027-01-01')!;
    expect(p.index).toBe(0);
    expect(p.start).toBe('2027-01-01');
    expect(p.end).toBe('2027-02-01');
  });

  it('tiles all 12 months', () => {
    expectTiling(periodsInYear(i, '2026-08-24'), '2026-01-01', '2027-01-01');
  });
});

describe('stage 2: CALENDAR + QUARTERLY', () => {
  it('yields Q1–Q4 with month-range labels', () => {
    const ps = periodsInYear(input({ cadence: 'QUARTERLY', basis: 'CALENDAR' }), '2026-05-15');
    expect(ps).toHaveLength(4);
    expectTiling(ps, '2026-01-01', '2027-01-01');
    expect(ps.map((p) => p.label)).toEqual(['Jan–Mar 2026', 'Apr–Jun 2026', 'Jul–Sep 2026', 'Oct–Dec 2026']);
    expect(periodFor(input({ cadence: 'QUARTERLY', basis: 'CALENDAR' }), '2026-05-15')!.index).toBe(1);
  });
});

describe('stage 2: ANNIVERSARY + MONTHLY across a calendar-year boundary', () => {
  const i = input({ cadence: 'MONTHLY', basis: 'ANNIVERSARY', openedAt: '2023-11-17' });

  it('the benefit year 2025-11-17 → 2026-11-17 tiles into 12 monthly buckets', () => {
    const ps = periodsInYear(i, '2026-01-05');
    expect(ps).toHaveLength(12);
    expectTiling(ps, '2025-11-17', '2026-11-17');
  });

  it('asOf 2026-01-05 sits in bucket 1 (Dec 17 – Jan 16), which straddles New Year', () => {
    const p = periodFor(i, '2026-01-05')!;
    expect(p.index).toBe(1);
    expect(p.start).toBe('2025-12-17');
    expect(p.end).toBe('2026-01-17');
    expect(p.label).toBe('Dec 17, 2025 – Jan 16, 2026');
  });

  it('day-31 anniversaries clamp through February and recover in March', () => {
    const j = input({ cadence: 'MONTHLY', basis: 'ANNIVERSARY', openedAt: '2024-01-31' });
    const ps = periodsInYear(j, '2025-02-15');
    expectTiling(ps, '2025-01-31', '2026-01-31');
    expect(ps[1]!.start).toBe('2025-02-28'); // clamped
    expect(ps[1]!.end).toBe('2025-03-31'); // recovered — boundaries come from yStart, not chained
    expect(periodFor(j, '2025-02-15')!.index).toBe(0);
  });

  it('Feb-29 opening: the final monthly bucket snaps to the true year end (2028-02-29)', () => {
    const j = input({ cadence: 'MONTHLY', basis: 'ANNIVERSARY', openedAt: '2024-02-29' });
    const ps = periodsInYear(j, '2027-06-01');
    expectTiling(ps, '2027-02-28', '2028-02-29');
    expect(ps[11]!.start).toBe('2028-01-28');
    expect(ps[11]!.end).toBe('2028-02-29'); // yEnd recovers Feb 29; chained boundary alone would stop at Feb 28
  });
});

describe('stage 2: ANNIVERSARY + SEMIANNUAL composes with no special-casing', () => {
  it('yields anniversary-based halves', () => {
    const i = input({ cadence: 'SEMIANNUAL', basis: 'ANNIVERSARY', openedAt: '2023-11-17' });
    const ps = periodsInYear(i, '2026-01-05');
    expect(ps).toHaveLength(2);
    expectTiling(ps, '2025-11-17', '2026-11-17');
    expect(ps[0]!.end).toBe('2026-05-17');
    expect(periodFor(i, '2026-01-05')!.index).toBe(0);
  });
});

describe('stage 2: FIXED_WINDOW subdivides too', () => {
  it('a year-long fixed window + QUARTERLY gives calendar quarters', () => {
    const i = input({ cadence: 'QUARTERLY', basis: 'FIXED_WINDOW', windowStart: '2026-01-01', windowEnd: '2027-01-01' });
    const p = periodFor(i, '2026-05-15')!;
    expect(p).toEqual({ start: '2026-04-01', end: '2026-07-01', index: 1, label: 'Apr–Jun 2026' });
  });

  it('a window shorter than the cadence grid caps at windowEnd instead of overshooting', () => {
    const i = input({ cadence: 'QUARTERLY', basis: 'FIXED_WINDOW', windowStart: '2026-01-01', windowEnd: '2026-03-01' });
    const ps = periodsInYear(i, '2026-02-15');
    expect(ps).toHaveLength(1);
    expect(ps[0]!.start).toBe('2026-01-01');
    expect(ps[0]!.end).toBe('2026-03-01');
  });
});

// ---------------------------------------------------------------------------
// The CSR legacy-holder case: same benefit, different basis, different windows
// ---------------------------------------------------------------------------

describe('CSR legacy-holder case: CALENDAR vs STATEMENT_ANNIVERSARY diverge for the same asOf', () => {
  const shared = {
    cadence: 'SEMIANNUAL' as const,
    openedAt: '2019-08-26',
    statementDayOfMonth: 13,
  };
  const asOf = '2026-08-24';

  it('CALENDAR basis: Jul–Dec 2026 half', () => {
    const p = periodFor(input({ ...shared, basis: 'CALENDAR' }), asOf)!;
    expect(p).toEqual({ start: '2026-07-01', end: '2027-01-01', index: 1, label: 'Jul–Dec 2026' });
  });

  it('STATEMENT_ANNIVERSARY basis: Mar 13 – Sep 12 half of the cardmember year', () => {
    const p = periodFor(input({ ...shared, basis: 'STATEMENT_ANNIVERSARY' }), asOf)!;
    expect(p).toEqual({ start: '2026-03-13', end: '2026-09-13', index: 1, label: 'Mar 13 – Sep 12, 2026' });
  });

  it('the two windows are genuinely different', () => {
    const cal = periodFor(input({ ...shared, basis: 'CALENDAR' }), asOf)!;
    const stmt = periodFor(input({ ...shared, basis: 'STATEMENT_ANNIVERSARY' }), asOf)!;
    expect(cal.start).not.toBe(stmt.start);
    expect(cal.end).not.toBe(stmt.end);
  });
});

// ---------------------------------------------------------------------------
// Special cadences
// ---------------------------------------------------------------------------

describe('NONE (perks)', () => {
  const i = input({ cadence: 'NONE', basis: 'CALENDAR' });
  it('has no periods at all', () => {
    expect(periodFor(i, '2026-08-24')).toBeNull();
    expect(benefitYearFor(i, '2026-08-24')).toBeNull();
    expect(periodsInYear(i, '2026-08-24')).toEqual([]);
  });
});

describe('ONE_TIME', () => {
  it('is a single open-ended period from the anchor when no window bounds it', () => {
    const i = input({ cadence: 'ONE_TIME', basis: 'ANNIVERSARY', openedAt: '2024-05-10' });
    const p = periodFor(i, '2026-08-24')!;
    expect(p.start).toBe('2024-05-10');
    expect(p.end).toBe(MAX_CIVIL); // no recurrence, no expiry
    expect(p.index).toBe(0);
    expect(periodFor(i, '2024-05-09')).toBeNull(); // before the anchor
  });

  it('respects an explicit fixed window (limited-time offers)', () => {
    const i = input({
      cadence: 'ONE_TIME',
      basis: 'FIXED_WINDOW',
      windowStart: '2026-01-01',
      windowEnd: '2026-04-01',
    });
    expect(periodFor(i, '2026-02-15')!.end).toBe('2026-04-01');
    expect(periodFor(i, '2026-04-01')).toBeNull();
  });
});

describe('EVERY_N_YEARS', () => {
  const i = input({ cadence: 'EVERY_N_YEARS', basis: 'ANNIVERSARY', openedAt: '2024-05-10', everyNYears: 4 });

  it('spans the whole N-year cycle, not just its first year', () => {
    // A Global Entry credit offered "every 4 years" is claimable at any point
    // in the cycle, so the window is 4 years long.
    const p = periodFor(i, '2024-12-01')!;
    expect(p.start).toBe('2024-05-10');
    expect(p.end).toBe('2028-05-10');
  });

  it('has no dead gap between cycles', () => {
    // Mid-cycle dates that a 12-month window would have left unclaimable.
    expect(periodFor(i, '2026-08-24')!.start).toBe('2024-05-10');
    expect(periodFor(i, '2028-05-09')!.start).toBe('2024-05-10');
  });

  it('recurs every N years from openedAt', () => {
    const p = periodFor(i, '2028-05-10')!;
    expect(p.start).toBe('2028-05-10');
    expect(p.end).toBe('2032-05-10');
  });

  it('tiles continuously: each cycle ends exactly where the next begins', () => {
    const first = periodFor(i, '2024-12-01')!;
    const second = periodFor(i, '2028-05-10')!;
    expect(first.end).toBe(second.start);
  });
});

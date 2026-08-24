import { describe, expect, it } from 'vitest';
import { periodsInYear } from '@/lib/periods';
import {
  emptyRollup,
  isFeeWorthIt,
  pointsToCents,
  projectedCents,
  rollup,
  rollupMany,
} from '@/lib/roi';
import type { PeriodFact, Rollup } from '@/lib/roi';
import { formatCents, formatCentsShort, parseDollarsToCents } from '@/lib/money';

function facts(cadence: 'MONTHLY' | 'ANNUAL', valueCents: number, asOf: string): PeriodFact[] {
  return periodsInYear({ cadence, basis: 'CALENDAR' }, asOf).map((p) => ({
    start: p.start,
    end: p.end,
    valueCents,
    usedCents: 0,
  }));
}

function expectInvariant(r: Rollup): void {
  expect(r.addressableToDateCents + r.unopenedCents).toBe(r.annualFaceValueCents);
}

// ---------------------------------------------------------------------------
// The $15/month vs $200/year case.
//
// NOTE on the spec's worked example: the prompt says "on 2026-08-01 ... 7
// buckets open (Jan–Jul), addressableToDate = 10500". That contradicts the
// prompt's own classification rule `opened: start <= asOf` — on 2026-08-01 the
// August bucket [2026-08-01, 2026-09-01) HAS opened (start == asOf), which is
// also what periodFor says (asOf equal to July's exclusive end lands in
// August). So on 2026-08-01 there are 8 opened buckets (12000); the quoted
// 10500/7500 numbers hold on 2026-07-31. We pin BOTH dates below. Either way
// the marquee point stands: addressable is $120 (or $105), NOT the $180
// marketing number.
// ---------------------------------------------------------------------------

describe('rollup: $15/month calendar credit vs $200 annual credit', () => {
  const monthly = facts('MONTHLY', 1500, '2026-08-01');
  const annual = facts('ANNUAL', 20000, '2026-08-01');

  it('materializes 12 monthly facts and 1 annual fact', () => {
    expect(monthly).toHaveLength(12);
    expect(annual).toHaveLength(1);
  });

  it('monthly on 2026-08-01: Jan–Aug opened (12000), Aug claimable, Jan–Jul forfeited', () => {
    const r = rollup(monthly, '2026-08-01');
    expect(r.annualFaceValueCents).toBe(18000); // the marketing number
    expect(r.addressableToDateCents).toBe(12000); // 8 slices opened — NOT 18000
    expect(r.unopenedCents).toBe(6000); // Sep–Dec
    expect(r.claimableNowCents).toBe(1500); // August, open today, untouched
    expect(r.forfeitedCents).toBe(10500); // Jan–Jul closed unused — lost slice by slice
    expect(r.capturedCents).toBe(0);
    expectInvariant(r);
  });

  it("monthly on 2026-07-31: the spec's 10500/7500 numbers hold here (7 buckets opened)", () => {
    const r = rollup(monthly, '2026-07-31');
    expect(r.addressableToDateCents).toBe(10500); // $105, not $180
    expect(r.unopenedCents).toBe(7500);
    expect(r.claimableNowCents).toBe(1500); // July still open
    expect(r.forfeitedCents).toBe(9000); // Jan–Jun
    expectInvariant(r);
  });

  it('annual on 2026-08-01: fully addressable and fully claimable from day one', () => {
    const r = rollup(annual, '2026-08-01');
    expect(r.addressableToDateCents).toBe(20000);
    expect(r.claimableNowCents).toBe(20000);
    expect(r.unopenedCents).toBe(0);
    expect(r.forfeitedCents).toBe(0);
    expectInvariant(r);
  });

  it('the two cadences are deliberately NOT treated alike when combined', () => {
    const combined = rollupMany([rollup(monthly, '2026-08-01'), rollup(annual, '2026-08-01')]);
    expect(combined.annualFaceValueCents).toBe(38000); // what marketing sums
    expect(combined.addressableToDateCents).toBe(32000); // what has actually opened
    expect(combined.claimableNowCents).toBe(21500); // $15 urgent slice + $200 at risk all year
    expect(combined.forfeitedCents).toBe(10500);
    expect(combined.unopenedCents).toBe(6000);
    expectInvariant(combined);
  });
});

describe('rollup: redemption states', () => {
  it('partial redemption: $120 used of $300 open → captured 12000, claimableNow 18000', () => {
    const r = rollup(
      [{ start: '2026-01-01', end: '2027-01-01', valueCents: 30000, usedCents: 12000 }],
      '2026-08-24',
    );
    expect(r.capturedCents).toBe(12000);
    expect(r.claimableNowCents).toBe(18000);
    expect(r.forfeitedCents).toBe(0);
    expect(r.addressableToDateCents).toBe(30000);
    expect(projectedCents(r)).toBe(30000);
  });

  it('a fully-unused closed period is fully forfeited', () => {
    const r = rollup(
      [{ start: '2026-01-01', end: '2026-02-01', valueCents: 1500, usedCents: 0 }],
      '2026-03-01',
    );
    expect(r.forfeitedCents).toBe(1500);
    expect(r.claimableNowCents).toBe(0);
    expect(r.capturedCents).toBe(0);
    expect(r.addressableToDateCents).toBe(1500); // it opened, then closed
  });

  it('a partially-used closed period forfeits only the remainder', () => {
    const r = rollup(
      [{ start: '2026-01-01', end: '2026-02-01', valueCents: 1500, usedCents: 1000 }],
      '2026-03-01',
    );
    expect(r.capturedCents).toBe(1000);
    expect(r.forfeitedCents).toBe(500);
  });

  it('overspend beyond face value: captured counts the raw sum, remainder floors at 0', () => {
    const r = rollup(
      [{ start: '2026-01-01', end: '2026-02-01', valueCents: 1500, usedCents: 2000 }],
      '2026-03-01',
    );
    expect(r.capturedCents).toBe(2000); // literal per spec: usedCents always adds to captured
    expect(r.forfeitedCents).toBe(0);
    expect(r.claimableNowCents).toBe(0);
  });

  it('a period that opens exactly on asOf is open (start <= asOf), not unopened', () => {
    const r = rollup(
      [{ start: '2026-08-01', end: '2026-09-01', valueCents: 1500, usedCents: 0 }],
      '2026-08-01',
    );
    expect(r.claimableNowCents).toBe(1500);
    expect(r.unopenedCents).toBe(0);
  });

  it('a period that closes exactly on asOf is closed (end <= asOf)', () => {
    const r = rollup(
      [{ start: '2026-07-01', end: '2026-08-01', valueCents: 1500, usedCents: 0 }],
      '2026-08-01',
    );
    expect(r.forfeitedCents).toBe(1500);
    expect(r.claimableNowCents).toBe(0);
  });
});

describe('rollupMany', () => {
  it('sums field-wise', () => {
    const a: Rollup = {
      capturedCents: 100,
      addressableToDateCents: 200,
      claimableNowCents: 50,
      forfeitedCents: 25,
      unopenedCents: 300,
      annualFaceValueCents: 500,
    };
    const b: Rollup = {
      capturedCents: 1,
      addressableToDateCents: 2,
      claimableNowCents: 3,
      forfeitedCents: 4,
      unopenedCents: 5,
      annualFaceValueCents: 7,
    };
    expect(rollupMany([a, b])).toEqual({
      capturedCents: 101,
      addressableToDateCents: 202,
      claimableNowCents: 53,
      forfeitedCents: 29,
      unopenedCents: 305,
      annualFaceValueCents: 507,
    });
  });

  it('of nothing is all zeros', () => {
    expect(rollupMany([])).toEqual(emptyRollup());
  });
});

describe('pointsToCents (integer math, round half up)', () => {
  it('10000 pts at 1500 milli-cents/pt = 15000 cents ($150.00)', () => {
    expect(pointsToCents(10000, 1500)).toBe(15000);
  });

  it('rounds half up', () => {
    expect(pointsToCents(1, 1500)).toBe(2); // 1.5c → 2c
    expect(pointsToCents(1, 500)).toBe(1); // 0.5c → 1c
    expect(pointsToCents(1, 499)).toBe(0); // 0.499c → 0c
    expect(pointsToCents(3, 333)).toBe(1); // 0.999c → 1c
    expect(pointsToCents(0, 1500)).toBe(0);
    expect(pointsToCents(12345, 1000)).toBe(12345); // 1c/pt exactly
  });
});

describe('isFeeWorthIt / projectedCents', () => {
  it('captured must meet or beat the fee', () => {
    expect(isFeeWorthIt(55000, 55000)).toBe(true);
    expect(isFeeWorthIt(54999, 55000)).toBe(false);
    expect(isFeeWorthIt(0, 0)).toBe(true);
  });

  it('projected = captured + claimableNow', () => {
    const r = { ...emptyRollup(), capturedCents: 12000, claimableNowCents: 18000 };
    expect(projectedCents(r)).toBe(30000);
  });
});

describe('money formatting/parsing', () => {
  it('formats cents as dollars', () => {
    expect(formatCents(15000)).toBe('$150.00');
    expect(formatCents(123456789)).toBe('$1,234,567.89');
    expect(formatCents(-501)).toBe('-$5.01');
    expect(formatCents(0)).toBe('$0.00');
  });

  it('short form drops .00 only', () => {
    expect(formatCentsShort(15000)).toBe('$150');
    expect(formatCentsShort(15050)).toBe('$150.50');
    expect(formatCentsShort(-500)).toBe('-$5');
  });

  it('parses user dollar input to integer cents', () => {
    expect(parseDollarsToCents('$1,234.56')).toBe(123456);
    expect(parseDollarsToCents('300')).toBe(30000);
    expect(parseDollarsToCents('.5')).toBe(50);
    expect(parseDollarsToCents('-12.34')).toBe(-1234);
    expect(parseDollarsToCents(' $ 45 ')).toBe(4500);
    expect(parseDollarsToCents('12.345')).toBeNull(); // sub-cent precision refused
    expect(parseDollarsToCents('abc')).toBeNull();
    expect(parseDollarsToCents('')).toBeNull();
  });
});

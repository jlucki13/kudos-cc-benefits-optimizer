/**
 * civil.ts — pure calendar-date primitives over 'YYYY-MM-DD' strings.
 *
 * A CivilDate is a *calendar* concept (no time-of-day, no timezone). Storing
 * real timestamps for benefit windows causes the classic bug where a user in
 * UTC-7 sees a credit expire a day early; a civil date cannot. ISO
 * 'YYYY-MM-DD' strings sort lexicographically in chronological order, so
 * comparisons are plain string compares and range queries are indexable.
 *
 * Zero dependencies: no Date, no date libraries, no Node built-ins.
 */

export type CivilDate = string; // 'YYYY-MM-DD'

const CIVIL_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse 'YYYY-MM-DD' strictly (zero-padded, real calendar day). Throws on malformed input. */
export function parseCivil(d: CivilDate): { y: number; m: number; d: number } {
  const match = CIVIL_RE.exec(d);
  if (!match) throw new TypeError(`Invalid CivilDate "${d}" (expected 'YYYY-MM-DD')`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  const day = Number(match[3]);
  if (m < 1 || m > 12) throw new RangeError(`Invalid month in CivilDate "${d}"`);
  if (day < 1 || day > daysInMonth(y, m)) throw new RangeError(`Invalid day in CivilDate "${d}"`);
  return { y, m, d: day };
}

/** Format a (y, m, d) triple as zero-padded 'YYYY-MM-DD'. */
export function toCivil(y: number, m: number, d: number): CivilDate {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Gregorian leap rule: divisible by 4, except centuries not divisible by 400. */
export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** Days in month m (1-12) of year y. daysInMonth(1900, 2) === 28; daysInMonth(2000, 2) === 29. */
export function daysInMonth(y: number, m: number): number {
  switch (m) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      return 31;
    case 4: case 6: case 9: case 11:
      return 30;
    case 2:
      return isLeapYear(y) ? 29 : 28;
    default:
      throw new RangeError(`Invalid month ${m}`);
  }
}

/**
 * Add months, clamping the day-of-month to the target month's length.
 * '2026-01-31' + 1 → '2026-02-28' (NOT Mar 3); '2024-01-31' + 1 → '2024-02-29';
 * '2026-05-31' + 1 → '2026-06-30'. Negative months work symmetrically.
 *
 * NOT associative under chaining: addMonthsClamped(addMonthsClamped(d, 1), 1)
 * can differ from addMonthsClamped(d, 2) because clamping loses the original
 * day. Always add the total offset from the original anchor date.
 */
export function addMonthsClamped(date: CivilDate, months: number): CivilDate {
  const { y, m, d } = parseCivil(date);
  const zeroBased = m - 1 + months;
  const ty = y + Math.floor(zeroBased / 12);
  const tm = ((zeroBased % 12) + 12) % 12 + 1;
  return toCivil(ty, tm, Math.min(d, daysInMonth(ty, tm)));
}

// ---------------------------------------------------------------------------
// Day arithmetic via days-from-civil-epoch (Howard Hinnant's algorithm).
// No Date objects anywhere.
// ---------------------------------------------------------------------------

/** Days since 1970-01-01 for a civil (y, m, d) triple. */
function daysFromCivil(y: number, m: number, d: number): number {
  const yy = y - (m <= 2 ? 1 : 0);
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400; // [0, 399]
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1; // [0, 365]
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy; // [0, 146096]
  return era * 146097 + doe - 719468;
}

/** Inverse of daysFromCivil. */
function civilFromDays(days: number): { y: number; m: number; d: number } {
  const z = days + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097; // [0, 146096]
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365,
  ); // [0, 399]
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100)); // [0, 365]
  const mp = Math.floor((5 * doy + 2) / 153); // [0, 11]
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1; // [1, 31]
  const m = mp + (mp < 10 ? 3 : -9); // [1, 12]
  return { y: y + (m <= 2 ? 1 : 0), m, d };
}

/** Add (or subtract) whole days. */
export function addDays(date: CivilDate, days: number): CivilDate {
  const { y, m, d } = parseCivil(date);
  const t = civilFromDays(daysFromCivil(y, m, d) + days);
  return toCivil(t.y, t.m, t.d);
}

/** -1 if a < b, 0 if equal, 1 if a > b. Lexicographic order IS chronological order for CivilDate. */
export function compareCivil(a: CivilDate, b: CivilDate): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Whole days from a to b (i.e. b - a). diffDays('2026-01-01', '2026-01-02') === 1. */
export function diffDays(a: CivilDate, b: CivilDate): number {
  const pa = parseCivil(a);
  const pb = parseCivil(b);
  return daysFromCivil(pb.y, pb.m, pb.d) - daysFromCivil(pa.y, pa.m, pa.d);
}

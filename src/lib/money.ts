/**
 * money.ts — integer money math and display helpers.
 *
 * Money is ALWAYS integer cents. Points valuations are milli-cents per point
 * (1.5 cents/pt → 1500), so conversions stay in integer math with no floats.
 * Zero dependencies.
 */

/**
 * Convert points to cents at a milli-cents-per-point valuation, rounding half
 * up (toward +Infinity at exactly .5). Integer math throughout:
 * pointsToCents(10000, 1500) === 15000 ($150.00 at 1.5 cents/pt).
 */
export function pointsToCents(points: number, milliCentsPerPoint: number): number {
  return Math.floor((points * milliCentsPerPoint + 500) / 1000);
}

/** '$1,234.56' (always two decimals; negatives as '-$5.01'). */
export function formatCents(cents: number): string {
  const n = Math.round(cents);
  const neg = n < 0;
  const abs = Math.abs(n);
  const dollars = Math.floor(abs / 100);
  const frac = abs % 100;
  const grouped = String(dollars).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}$${grouped}.${String(frac).padStart(2, '0')}`;
}

/** Like formatCents but drops '.00' for whole-dollar amounts: '$150', '$150.50'. */
export function formatCentsShort(cents: number): string {
  const n = Math.round(cents);
  return n % 100 === 0 ? formatCents(n).slice(0, -3) : formatCents(n);
}

/**
 * Parse a user-entered dollar string into integer cents.
 * Accepts '$1,234.56', '300', '.5', '-12.34' (also with spaces/commas).
 * Returns null for anything malformed or with more than 2 decimals — the
 * caller decides how to surface the error. Never floats.
 */
export function parseDollarsToCents(input: string): number | null {
  const s = input.replace(/[$,\s]/g, '');
  const m = /^(-)?(\d+(\.\d{0,2})?|\.\d{1,2})$/.exec(s);
  if (!m) return null;
  const neg = m[1] === '-';
  const body = m[2] as string;
  const dot = body.indexOf('.');
  const dollarPart = dot === -1 ? body : body.slice(0, dot);
  const centPart = dot === -1 ? '' : body.slice(dot + 1);
  const dollars = dollarPart === '' ? 0 : Number(dollarPart);
  const cents = Number((centPart + '00').slice(0, 2));
  const total = dollars * 100 + cents;
  return neg ? -total : total;
}

/**
 * format.ts — display formatting for integer cents.
 *
 * Hoisted from src/components/shell/format.tsx (which now re-exports from
 * here) so the query layer can build preformatted labels with the exact same
 * rules the UI renders with. Whole-dollar amounts drop the ".00".
 */

/** '$795', '$75,000', '$12.50'; negatives as '-$5.01'. Whole dollars drop cents. */
export function formatCents(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const rem = abs % 100;
  const base =
    rem === 0
      ? `$${dollars.toLocaleString('en-US')}`
      : `$${dollars.toLocaleString('en-US')}.${String(rem).padStart(2, '0')}`;
  return negative ? `-${base}` : base;
}

/** "+$155" / "-$545" — for net/projection figures where the sign is the point. */
export function formatCentsSigned(cents: number): string {
  return cents >= 0 ? `+${formatCents(cents)}` : formatCents(cents);
}

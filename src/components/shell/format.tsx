/**
 * Money formatting for integer cents.
 *
 * Lives in shell/ because W4 only owns component directories; a future pass
 * may hoist this to src/lib/format.ts and update imports.
 */
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

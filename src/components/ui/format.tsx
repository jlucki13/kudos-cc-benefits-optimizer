/** Money helpers for presentational components. All amounts are integer cents. */
export function formatCents(cents: number): string {
  const isWhole = cents % 100 === 0;
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  });
}

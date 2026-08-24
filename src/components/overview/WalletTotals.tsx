import type { CardVM } from '@/lib/view-models';

import { formatCents } from '@/components/shell/format';

/** Wallet-wide fees vs captured value, with an earned-back progress bar. */
export default function WalletTotals({ cards }: { cards: CardVM[] }) {
  const totalFeeCents = cards.reduce((sum, card) => sum + card.roi.annualFeeCents, 0);
  const totalCapturedCents = cards.reduce((sum, card) => sum + card.roi.capturedCents, 0);
  const percent = totalFeeCents > 0 ? Math.round((totalCapturedCents / totalFeeCents) * 100) : 0;

  return (
    <section className="rounded-2xl bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex divide-x divide-black/5">
        <div className="flex-1 pr-4">
          <p className="text-[11px] font-semibold tracking-[0.05em] text-ink-tertiary uppercase">Annual fees</p>
          <p className="mt-0.5 text-[24px] leading-tight font-bold text-ink">{formatCents(totalFeeCents)}</p>
        </div>
        <div className="flex-1 pl-4">
          <p className="text-[11px] font-semibold tracking-[0.05em] text-ink-tertiary uppercase">Captured so far</p>
          <p className="mt-0.5 text-[24px] leading-tight font-bold text-positive">{formatCents(totalCapturedCents)}</p>
        </div>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-black/6">
        <div
          className="h-full rounded-full bg-positive"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <p className="mt-2 text-[12px] text-ink-secondary">
        You&rsquo;ve earned back {percent}% of this year&rsquo;s annual fees.
      </p>
    </section>
  );
}

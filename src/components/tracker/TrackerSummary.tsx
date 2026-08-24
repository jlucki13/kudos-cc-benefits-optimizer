import type { RollupVM } from '@/lib/view-models';

import { formatCents } from '@/components/shell/format';

/**
 * Headline rollup: the claimable figure is the hero; forfeited money — the
 * entire point of the app — is called out in red whenever it exists.
 */
export default function TrackerSummary({ totals }: { totals: RollupVM }) {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <p className="text-[13px] font-medium text-ink-secondary">Still available to claim</p>
      <p className="mt-0.5 text-[40px] leading-none font-bold tracking-tight text-ink">
        {formatCents(totals.claimableNowCents)}
      </p>
      <div className="mt-4 flex divide-x divide-black/5 border-t border-black/5 pt-3.5">
        <div className="flex-1 pr-4">
          <p className="text-[11px] font-semibold tracking-[0.05em] text-ink-tertiary uppercase">Captured</p>
          <p className="mt-0.5 text-[17px] font-semibold text-positive">{formatCents(totals.capturedCents)}</p>
        </div>
        {totals.forfeitedCents > 0 ? (
          <div className="flex-1 pl-4">
            <p className="text-[11px] font-semibold tracking-[0.05em] text-ink-tertiary uppercase">Missed</p>
            <p className="mt-0.5 text-[17px] font-semibold text-danger">
              {formatCents(totals.forfeitedCents)} expired unused
            </p>
          </div>
        ) : (
          <div className="flex-1 pl-4">
            <p className="text-[11px] font-semibold tracking-[0.05em] text-ink-tertiary uppercase">Missed</p>
            <p className="mt-0.5 text-[17px] font-semibold text-ink">$0</p>
          </div>
        )}
      </div>
    </section>
  );
}

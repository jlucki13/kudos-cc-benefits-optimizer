import type { CardVM } from '@/lib/view-models';

import { formatCents, formatCentsSigned } from '@/components/shell/format';

function CompareBar({
  label,
  cents,
  maxCents,
  fillClass,
}: {
  label: string;
  cents: number;
  maxCents: number;
  fillClass: string;
}) {
  const percent = maxCents > 0 ? Math.min(100, Math.round((cents / maxCents) * 100)) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[62px] shrink-0 text-[11px] font-medium text-ink-tertiary">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/6">
        <div className={`h-full rounded-full ${fillClass}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="w-[56px] shrink-0 text-right text-[12px] font-semibold text-ink tabular-nums">
        {formatCents(cents)}
      </span>
    </div>
  );
}

/** Per-card "is the annual fee worth it": captured vs fee, verdict, projection. */
export default function FeeVsValueCard({ card }: { card: CardVM }) {
  const { roi } = card;
  const maxCents = Math.max(roi.annualFeeCents, roi.capturedCents, 1);
  const shortCents = roi.annualFeeCents - roi.capturedCents;
  const projectionPositive = roi.projectedNetCents >= 0;

  return (
    <section className="rounded-2xl bg-surface p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-ink">{card.name}</h3>
          <p className="mt-0.5 text-[12px] text-ink-secondary">{card.annualFeeLabel} annual fee</p>
        </div>
        {roi.isWorthItToday ? (
          <span className="shrink-0 rounded-full bg-positive-soft px-2.5 py-1 text-[11px] leading-none font-semibold text-positive">
            Worth it
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-warn-soft px-2.5 py-1 text-[11px] leading-none font-semibold text-warn">
            {formatCents(shortCents)} short
          </span>
        )}
      </div>
      <div className="mt-3.5 space-y-2">
        <CompareBar label="Captured" cents={roi.capturedCents} maxCents={maxCents} fillClass="bg-positive" />
        <CompareBar label="Annual fee" cents={roi.annualFeeCents} maxCents={maxCents} fillClass="bg-ink-tertiary/60" />
      </div>
      <p className="mt-3.5 border-t border-black/5 pt-3 text-[12px] text-ink-secondary">
        Use everything still open and you net{' '}
        <span className={`font-semibold ${projectionPositive ? 'text-positive' : 'text-danger'}`}>
          {formatCentsSigned(roi.projectedNetCents)}
        </span>{' '}
        this year.
      </p>
    </section>
  );
}

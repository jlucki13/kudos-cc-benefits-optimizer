import type { TrackerGroup, TrackerItemVM } from '@/lib/view-models';

import { formatCents } from '@/components/shell/format';
import BrandCircle from '@/components/tracker/BrandCircle';
import MiniBar, { type MiniBarTone } from '@/components/tracker/MiniBar';

function daysText(days: number): string {
  return days === 1 ? '1 day' : `${days} days`;
}

function pillFor(item: TrackerItemVM, group: TrackerGroup): { text: string; cls: string } {
  if (group === 'missed') return { text: 'Expired', cls: 'bg-danger-soft text-danger' };
  const period = item.currentPeriod;
  if (!period) return { text: item.cadenceLabel || 'Perk', cls: 'bg-black/5 text-ink-secondary' };
  if (period.valueCents !== null && period.remainingCents <= 0) {
    return { text: '✓ Used', cls: 'bg-positive-soft text-positive' };
  }
  if (period.daysLeft <= 7) return { text: daysText(period.daysLeft), cls: 'bg-danger-soft text-danger' };
  if (period.daysLeft <= 30) return { text: daysText(period.daysLeft), cls: 'bg-warn-soft text-warn' };
  return { text: daysText(period.daysLeft), cls: 'bg-black/5 text-ink-secondary' };
}

function barTone(item: TrackerItemVM, group: TrackerGroup): MiniBarTone {
  if (group === 'missed') return 'danger';
  const period = item.currentPeriod;
  if (period && period.valueCents !== null && period.remainingCents <= 0) return 'positive';
  return 'accent';
}

/**
 * One benefit lifted out of its card: brand circle, card label, title,
 * progress against face value (or spend threshold), and a days-left pill.
 */
export default function BenefitRow({ item, group }: { item: TrackerItemVM; group: TrackerGroup }) {
  const period = item.currentPeriod;
  const pill = pillFor(item, group);
  const showBar = period !== null && period.valueCents !== null;

  return (
    <div className="flex gap-3 px-4 py-3.5">
      <BrandCircle seed={item.brandKey ?? item.shortTitle} />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-[0.06em] text-ink-tertiary uppercase">
          {item.cardShortName}
        </p>
        <div className="mt-0.5 flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-[15px] leading-snug font-semibold text-ink">{item.shortTitle}</p>
          <span className={`mt-px shrink-0 rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold ${pill.cls}`}>
            {pill.text}
          </span>
        </div>
        {showBar && period && period.valueCents !== null ? (
          <>
            <div className="mt-2">
              <MiniBar percent={period.percentUsed} tone={barTone(item, group)} />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <p className="text-[12px] text-ink-secondary">
                {formatCents(period.usedCents)} of {formatCents(period.valueCents)}
                {item.kind === 'SPEND_THRESHOLD' ? '' : ' used'}
              </p>
              <p className="shrink-0 text-[11px] text-ink-tertiary">{period.label}</p>
            </div>
          </>
        ) : (
          <p className="mt-1 line-clamp-1 text-[12px] text-ink-secondary">{item.description}</p>
        )}
      </div>
    </div>
  );
}

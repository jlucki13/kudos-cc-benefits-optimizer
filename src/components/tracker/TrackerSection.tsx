import type { TrackerGroup, TrackerItemVM } from '@/lib/view-models';

import BenefitRow from '@/components/tracker/BenefitRow';

/** daysLeft ascending, then remainingCents descending. Perks keep their order at the end. */
export function sortTrackerItems(items: TrackerItemVM[]): TrackerItemVM[] {
  return [...items].sort((a, b) => {
    const da = a.currentPeriod?.daysLeft ?? Number.POSITIVE_INFINITY;
    const db = b.currentPeriod?.daysLeft ?? Number.POSITIVE_INFINITY;
    if (da !== db) return da - db;
    return (b.currentPeriod?.remainingCents ?? 0) - (a.currentPeriod?.remainingCents ?? 0);
  });
}

/** Grey uppercase header + white grouped card of rows. Hidden when empty. */
export default function TrackerSection({
  title,
  group,
  items,
  presorted = false,
}: {
  title: string;
  group: TrackerGroup;
  items: TrackerItemVM[];
  presorted?: boolean;
}) {
  if (items.length === 0) return null;
  const rows = presorted ? items : sortTrackerItems(items);
  return (
    <section>
      <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-[0.05em] text-ink-secondary uppercase">
        {title}
      </h2>
      <div className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        {rows.map((item) => (
          <BenefitRow
            key={`${item.userCardId}-${item.slug}-${item.currentPeriod?.start ?? 'none'}`}
            item={item}
            group={group}
          />
        ))}
      </div>
    </section>
  );
}

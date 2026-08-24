import type { TrackerGroup, TrackerVM } from '@/lib/view-models';

import EmptyWallet from '@/components/shell/EmptyWallet';
import TopBar from '@/components/shell/TopBar';
import TopTabs from '@/components/shell/TopTabs';
import { demoTrackerVM } from '@/components/tracker/demo-data';
import TrackerSection from '@/components/tracker/TrackerSection';
import TrackerSummary from '@/components/tracker/TrackerSummary';
import { emptyTrackerFixture } from '@/lib/fixtures';

const GROUP_ORDER: TrackerGroup[] = ['expiring', 'available', 'used', 'missed', 'untracked'];

const GROUP_LABELS: Record<TrackerGroup, string> = {
  expiring: 'Expiring soon',
  available: 'Available now',
  used: 'Used',
  missed: 'Missed',
  untracked: 'Not tracked',
};

function getTrackerData(): TrackerVM {
  // TODO(W5): replace with real query
  return emptyTrackerFixture;
}

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const vm = sp.demo !== undefined ? demoTrackerVM : getTrackerData();
  const isEmpty = vm.groups.every((group) => group.items.length === 0);

  return (
    <>
      <TopBar />
      <TopTabs active="tracker" />
      {isEmpty ? (
        <EmptyWallet />
      ) : (
        <div className="space-y-6 px-4 pt-4">
          <TrackerSummary totals={vm.totals} />
          {GROUP_ORDER.map((key) => {
            const group = vm.groups.find((g) => g.key === key);
            if (!group) return null;
            return (
              <TrackerSection key={key} title={group.label || GROUP_LABELS[key]} group={key} items={group.items} />
            );
          })}
        </div>
      )}
    </>
  );
}

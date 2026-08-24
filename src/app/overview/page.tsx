import type { CardVM } from '@/lib/view-models';

import EmptyWallet from '@/components/shell/EmptyWallet';
import TopBar from '@/components/shell/TopBar';
import TopTabs from '@/components/shell/TopTabs';
import FeeVsValueCard from '@/components/overview/FeeVsValueCard';
import WalletTotals from '@/components/overview/WalletTotals';
import { demoWalletVM } from '@/components/tracker/demo-data';

function getOverviewData(): CardVM[] {
  // TODO(W5): replace with real query
  return [];
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const cards = sp.demo !== undefined ? demoWalletVM : getOverviewData();

  return (
    <>
      <TopBar />
      <TopTabs active="overview" />
      {cards.length === 0 ? (
        <EmptyWallet body="Add a card and we'll show whether its annual fee actually pays for itself." />
      ) : (
        <div className="space-y-4 px-4 pt-4">
          <WalletTotals cards={cards} />
          <div className="space-y-3">
            {cards.map((card) => (
              <FeeVsValueCard key={card.userCardId} card={card} />
            ))}
          </div>
          <p className="px-4 pt-1 text-center text-[11px] leading-relaxed text-ink-tertiary">
            Dollar totals count statement credits and points grants only — spend-threshold benefits and perks are
            never converted to dollars.
          </p>
        </div>
      )}
    </>
  );
}

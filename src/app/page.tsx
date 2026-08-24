import Link from 'next/link';

import type { TrackerVM } from '@/lib/view-models';

import EmptyWallet from '@/components/shell/EmptyWallet';
import { formatCents } from '@/components/shell/format';
import TopBar from '@/components/shell/TopBar';
import BenefitRow from '@/components/tracker/BenefitRow';
import { demoTrackerVM } from '@/components/tracker/demo-data';
import { sortTrackerItems } from '@/components/tracker/TrackerSection';
import { emptyTrackerFixture } from '@/lib/fixtures';

function getHomeData(): TrackerVM {
  // TODO(W5): replace with real query
  return emptyTrackerFixture;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const vm = sp.demo !== undefined ? demoTrackerVM : getHomeData();
  const isEmpty = vm.groups.every((group) => group.items.length === 0);
  const expiring = sortTrackerItems(vm.groups.find((g) => g.key === 'expiring')?.items ?? []).slice(0, 4);

  return (
    <>
      <TopBar title="Home" />
      {isEmpty ? (
        <EmptyWallet
          title="Welcome to Kudos"
          body="Add your cards and we'll surface every credit before it quietly expires."
        />
      ) : (
        <div className="space-y-6 px-4 pt-2">
          <section className="rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-5 text-white shadow-[0_14px_30px_rgba(108,92,231,0.35)]">
            <p className="text-[13px] font-medium text-white/75">You&rsquo;re leaving</p>
            <p className="mt-1 text-[44px] leading-none font-bold tracking-tight">
              {formatCents(vm.totals.claimableNowCents)}
            </p>
            <p className="mt-1.5 text-[13px] font-medium text-white/75">on the table in unclaimed credits</p>
            {vm.totals.forfeitedCents > 0 && (
              <p className="mt-3.5 rounded-xl bg-white/12 px-3 py-2 text-[12px] font-medium">
                {formatCents(vm.totals.forfeitedCents)} already expired unused this year — don&rsquo;t let the rest
                slip.
              </p>
            )}
            <Link
              href="/tracker"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-accent active:opacity-80"
            >
              Open benefits tracker
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4.5 12h15" />
                <path d="m13 5.5 6.5 6.5-6.5 6.5" />
              </svg>
            </Link>
          </section>

          {expiring.length > 0 && (
            <section>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="text-[13px] font-semibold tracking-[0.05em] text-ink-secondary uppercase">
                  Expiring soon
                </h2>
                <Link href="/tracker" className="text-[13px] font-semibold text-accent">
                  See all
                </Link>
              </div>
              <div className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {expiring.map((item) => (
                  <BenefitRow
                    key={`${item.userCardId}-${item.slug}-${item.currentPeriod?.start ?? 'none'}`}
                    item={item}
                    group="expiring"
                  />
                ))}
              </div>
            </section>
          )}

          <Link
            href="/tracker"
            className="block rounded-2xl bg-surface px-4 py-3.5 text-center text-[15px] font-semibold text-accent shadow-[0_1px_2px_rgba(0,0,0,0.05)] active:opacity-80"
          >
            View full benefits tracker
          </Link>
        </div>
      )}
    </>
  );
}

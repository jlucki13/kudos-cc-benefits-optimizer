import Link from 'next/link';

export type TopTabKey = 'cards' | 'overview' | 'tracker';

const TABS: { key: TopTabKey; label: string; href: string }[] = [
  { key: 'cards', label: 'Cards', href: '/cards' },
  { key: 'overview', label: 'Overview', href: '/overview' },
  { key: 'tracker', label: 'Benefits tracker', href: '/tracker' },
];

/**
 * Horizontally scrollable section tabs. "Card-linked offers" is a real product
 * tab with no v1 data source, so it renders disabled rather than faking a screen.
 */
export default function TopTabs({ active }: { active: TopTabKey }) {
  return (
    <nav className="no-scrollbar sticky top-0 z-20 flex items-end gap-6 overflow-x-auto border-b border-black/5 bg-app-bg/95 px-5 backdrop-blur">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`-mb-px shrink-0 border-b-2 pt-2 pb-2.5 text-[15px] font-semibold whitespace-nowrap ${
              isActive
                ? 'border-accent text-accent'
                : 'border-transparent text-ink-tertiary active:text-ink-secondary'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
      <span
        aria-disabled="true"
        title="Coming soon"
        className="-mb-px shrink-0 cursor-not-allowed border-b-2 border-transparent pt-2 pb-2.5 text-[15px] font-semibold whitespace-nowrap text-ink-tertiary/45 select-none"
      >
        Card-linked offers
      </span>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 10.6 12 3.8l8.5 6.8" />
      <path d="M5.8 9.4V20h12.4V9.4" />
    </svg>
  );
}

function SpendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 20v-5.5" />
      <path d="M9.5 20V9.5" />
      <path d="M14.5 20v-7.5" />
      <path d="M19.5 20V5" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18.5 7.2V6a2 2 0 0 0-2-2H6.2A2.2 2.2 0 0 0 4 6.2" />
      <rect x="4" y="7.2" width="16.5" height="12" rx="2.4" />
      <circle cx="16.6" cy="13.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 8h12l-1.1 12H7.1L6 8Z" />
      <path d="M9 8V6.6a3 3 0 0 1 6 0V8" />
    </svg>
  );
}

function CardsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="M3 9.8h18" />
      <path d="M6.4 14.6h4" />
    </svg>
  );
}

const ITEMS: {
  key: string;
  label: string;
  href?: string;
  disabled?: boolean;
  icon: () => React.JSX.Element;
  isActive?: (pathname: string) => boolean;
}[] = [
  { key: 'home', label: 'Home', href: '/', icon: HomeIcon, isActive: (p) => p === '/' },
  // No spend-tracking data source in v1 — visibly disabled instead of a fake screen.
  { key: 'spend', label: 'Spend', disabled: true, icon: SpendIcon },
  {
    key: 'wallet',
    label: 'Wallet',
    href: '/cards',
    icon: WalletIcon,
    isActive: (p) => p === '/cards' || (p.startsWith('/cards/') && p !== '/cards/add'),
  },
  // No shopping/offers data source in v1.
  { key: 'shop', label: 'Shop', disabled: true, icon: ShopIcon },
  { key: 'cards', label: 'Cards', href: '/cards/add', icon: CardsIcon, isActive: (p) => p === '/cards/add' },
];

/** Floating pill bottom nav, pinned inside the phone frame. */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none absolute inset-x-4 bottom-4 z-30">
      <div className="pointer-events-auto flex items-center justify-between rounded-[26px] border border-black/5 bg-white/90 px-2.5 py-1.5 shadow-[0_10px_30px_rgba(20,20,30,0.16)] backdrop-blur-xl">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = !item.disabled && item.href !== undefined && (item.isActive?.(pathname) ?? false);
          const inner = (
            <>
              <Icon />
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          );
          if (item.disabled) {
            return (
              <span
                key={item.key}
                aria-disabled="true"
                title="Coming soon"
                className="flex w-[62px] cursor-not-allowed flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-ink-tertiary opacity-45 select-none"
              >
                {inner}
              </span>
            );
          }
          return (
            <Link
              key={item.key}
              href={item.href!}
              aria-current={active ? 'page' : undefined}
              className={`flex w-[62px] flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 ${
                active ? 'bg-accent-soft text-accent' : 'text-ink-secondary active:text-ink'
              }`}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

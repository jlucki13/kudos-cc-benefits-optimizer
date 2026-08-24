import Link from 'next/link';

/** Shared first-run empty state for tracker / overview / home. */
export default function EmptyWallet({
  title = 'No cards yet',
  body = "Add the cards in your wallet and we'll track every credit before it expires.",
  cta = 'Add your first card',
}: {
  title?: string;
  body?: string;
  cta?: string;
}) {
  return (
    <div className="flex flex-col items-center px-8 pt-20 pb-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
          <path d="M2.5 9.8h19" />
          <path d="M6 14.6h4.5" />
        </svg>
      </div>
      <h2 className="mt-5 text-[20px] font-bold text-ink">{title}</h2>
      <p className="mt-1.5 max-w-[280px] text-[14px] leading-relaxed text-ink-secondary">{body}</p>
      <Link
        href="/cards/add"
        className="mt-6 rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(108,92,231,0.35)] active:opacity-80"
      >
        {cta}
      </Link>
    </div>
  );
}

import Link from 'next/link';

/** Large iOS-style title with the add-card action on the right. */
export default function TopBar({ title = 'Cards' }: { title?: string }) {
  return (
    <header className="flex items-end justify-between px-5 pt-5 pb-2">
      <h1 className="text-[28px] leading-tight font-bold tracking-tight text-ink">{title}</h1>
      <Link
        href="/cards/add"
        className="pb-1 text-[15px] font-semibold text-accent active:opacity-70"
      >
        + Add card
      </Link>
    </header>
  );
}

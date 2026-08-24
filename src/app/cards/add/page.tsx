import Link from 'next/link';

import type { CatalogEntryVM } from '@/lib/view-models';

import AddCardBrowser from '@/components/add-card/AddCardBrowser';
import { getCatalogEntries } from '@/lib/queries';

function getCatalog(): Promise<CatalogEntryVM[]> {
  return getCatalogEntries();
}

export default async function AddCardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  let entries = await getCatalog();
  if (sp.demo !== undefined) {
    // Dev preview of the "already in wallet" state.
    entries = entries.map((entry) =>
      entry.slug === 'chase-sapphire-reserve' ? { ...entry, alreadyInWallet: true } : entry,
    );
  }

  return (
    <>
      <header className="px-5 pt-4 pb-1">
        <Link href="/cards" className="inline-flex items-center gap-0.5 text-[14px] font-medium text-accent">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
          </svg>
          Cards
        </Link>
        <h1 className="mt-1.5 text-[28px] leading-tight font-bold tracking-tight text-ink">Add a card</h1>
        <p className="mt-1 text-[13px] text-ink-secondary">
          Pick from the catalog and we&rsquo;ll start tracking its credits.
        </p>
      </header>
      <AddCardBrowser entries={entries} />
    </>
  );
}

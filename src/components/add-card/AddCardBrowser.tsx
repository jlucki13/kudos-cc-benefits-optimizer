'use client';

import { useMemo, useState } from 'react';

import type { CatalogEntryVM } from '@/lib/view-models';

import MiniCardFace from '@/components/add-card/MiniCardFace';

function groupByIssuer(entries: CatalogEntryVM[]): [string, CatalogEntryVM[]][] {
  const groups = new Map<string, CatalogEntryVM[]>();
  for (const entry of entries) {
    const list = groups.get(entry.issuerDisplayName) ?? [];
    list.push(entry);
    groups.set(entry.issuerDisplayName, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([issuer, list]) => [issuer, [...list].sort((a, b) => a.name.localeCompare(b.name))]);
}

/** Searchable catalog list, grouped by issuer. */
export default function AddCardBrowser({ entries }: { entries: CatalogEntryVM[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) ||
        entry.shortName.toLowerCase().includes(q) ||
        entry.issuerDisplayName.toLowerCase().includes(q),
    );
  }, [entries, query]);

  const groups = useMemo(() => groupByIssuer(filtered), [filtered]);

  return (
    <div className="px-4 pt-3">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-ink-tertiary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by card or issuer"
          aria-label="Search the card catalog"
          className="w-full rounded-xl bg-surface py-2.5 pr-4 pl-10 text-[15px] text-ink shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-ink-tertiary focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {groups.length === 0 ? (
        <p className="pt-14 text-center text-[14px] text-ink-secondary">No cards match</p>
      ) : (
        <div className="mt-5 space-y-6">
          {groups.map(([issuer, list]) => (
            <section key={issuer}>
              <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-[0.05em] text-ink-secondary uppercase">
                {issuer}
              </h2>
              <div className="divide-y divide-black/5 overflow-hidden rounded-2xl bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                {list.map((entry) => (
                  <div key={entry.slug} className="flex items-center gap-3 px-4 py-3">
                    <MiniCardFace art={entry.art} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">{entry.name}</p>
                      <p className="mt-0.5 text-[12px] text-ink-secondary">
                        {entry.annualFeeLabel} annual fee · {entry.benefitCount} benefits
                      </p>
                    </div>
                    {entry.alreadyInWallet ? (
                      <span className="shrink-0 rounded-full bg-black/5 px-4 py-1.5 text-[13px] font-semibold text-ink-tertiary">
                        Added
                      </span>
                    ) : (
                      <button
                        type="button"
                        // TODO(W5): wire the add-to-wallet server action.
                        className="shrink-0 rounded-full bg-accent px-4 py-1.5 text-[13px] font-semibold text-white active:opacity-80"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

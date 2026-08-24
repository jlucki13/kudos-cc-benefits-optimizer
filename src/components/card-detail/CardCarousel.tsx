'use client';

import type { CardArtSpec } from '@/catalog/types';
import { CardArt } from '@/components/card-art/CardArt';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

export interface CarouselCard {
  id: string;
  name: string;
  network: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  art: CardArtSpec;
}

interface CardCarouselProps {
  cards: CarouselCard[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Thumbnail rail (selected thumb gets a purple circled checkmark) above the
 * hero card art, which is flanked by previous/next chevrons.
 */
export function CardCarousel({ cards, selectedId, onSelect }: CardCarouselProps) {
  const index = Math.max(
    0,
    cards.findIndex((card) => card.id === selectedId),
  );
  const selected = cards[index];
  if (!selected) return null;
  const step = (delta: number) => {
    const next = cards[index + delta];
    if (next) onSelect(next.id);
  };
  return (
    <div>
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-max items-center gap-3 px-6 py-2">
          {cards.map((card) => {
            const isSelected = card.id === selected.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelect(card.id)}
                aria-pressed={isSelected}
                aria-label={`Show ${card.name}`}
                className="relative shrink-0"
              >
                <CardArt spec={card.art} name={card.name} network={card.network} size="thumb" />
                {isSelected ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#6C5CE7] ring-2 ring-white">
                    <CheckIcon size={10} strokeWidth={3.5} className="text-white" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 px-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={index <= 0}
          aria-label="Previous card"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-400 active:bg-neutral-100 disabled:opacity-30"
        >
          <ChevronLeftIcon size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <CardArt spec={selected.art} name={selected.name} network={selected.network} size="hero" />
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={index >= cards.length - 1}
          aria-label="Next card"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-400 active:bg-neutral-100 disabled:opacity-30"
        >
          <ChevronRightIcon size={22} />
        </button>
      </div>
    </div>
  );
}

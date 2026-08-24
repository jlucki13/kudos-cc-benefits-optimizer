'use client';

import { useState } from 'react';

import { Sheet } from '@/components/ui/Sheet';

interface RemoveCardButtonProps {
  onRemove: () => void;
  cardName?: string;
}

/** Destructive action: always confirms via a bottom sheet before firing onRemove. */
export function RemoveCardButton({ onRemove, cardName }: RemoveCardButtonProps) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="px-5">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="h-12 w-full rounded-2xl bg-[#C0392B] text-[15px] font-semibold text-white active:opacity-90"
      >
        Remove Card
      </button>
      <Sheet
        open={confirming}
        onClose={() => setConfirming(false)}
        title={cardName ? `Remove ${cardName}?` : 'Remove this card?'}
      >
        <p className="mt-2 text-center text-[14px] leading-5 text-neutral-600">
          This removes the card and its tracked benefit progress from your wallet. You can add it again
          later, but tracking starts over.
        </p>
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            onRemove();
          }}
          className="mt-5 h-12 w-full rounded-2xl bg-[#C0392B] text-[15px] font-semibold text-white"
        >
          Remove Card
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="mt-2.5 h-12 w-full rounded-2xl bg-neutral-100 text-[15px] font-semibold text-neutral-900"
        >
          Cancel
        </button>
      </Sheet>
    </div>
  );
}

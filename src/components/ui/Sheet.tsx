'use client';

import type { ReactNode } from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Minimal bottom sheet for confirmations. Renders nothing while closed. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-[390px] rounded-t-[20px] bg-white px-5 pb-8 pt-3">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-neutral-300" aria-hidden="true" />
        {title ? <h2 className="text-center text-[17px] font-bold text-neutral-900">{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}

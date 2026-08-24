import type { ReactNode } from 'react';

const TONES = {
  lavender: 'bg-[#EFEBFB] text-neutral-900',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-600',
  neutral: 'bg-neutral-100 text-neutral-600',
} as const;

export type ChipTone = keyof typeof TONES;

interface ChipProps {
  tone?: ChipTone;
  className?: string;
  children: ReactNode;
}

/** Small rounded pill for statuses and inline highlights. */
export function Chip({ tone = 'lavender', className = '', children }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[13px] font-semibold ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

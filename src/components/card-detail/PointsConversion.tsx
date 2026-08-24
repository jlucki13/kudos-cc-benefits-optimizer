'use client';

import type { CardVM } from '@/lib/view-models';
import { Section } from '@/components/ui/Section';
import { ChevronDownIcon } from '@/components/ui/icons';

export type RedemptionMethod = CardVM['redemptionMethod'];

const METHOD_LABELS: Record<RedemptionMethod, string> = {
  DEFAULT: 'Default',
  CASH_BACK: 'Cash back',
  TRAVEL_PORTAL: 'Travel portal',
  TRANSFER_PARTNERS: 'Transfer partners',
};

interface PointsConversionProps {
  value: RedemptionMethod;
  onChange: (value: RedemptionMethod) => void;
  className?: string;
}

export function PointsConversion({ value, onChange, className }: PointsConversionProps) {
  return (
    <Section title="Points to dollar conversion" className={className}>
      <div className="px-5 pt-1.5">
        <label htmlFor="points-conversion-method" className="text-[13px] font-medium text-neutral-800">
          How you redeem your points
        </label>
        <div className="relative mt-2">
          <select
            id="points-conversion-method"
            value={value}
            onChange={(event) => onChange(event.target.value as RedemptionMethod)}
            className="h-12 w-full appearance-none rounded-xl border border-neutral-300 bg-white px-4 pr-10 text-[15px] font-medium text-neutral-900"
          >
            {(Object.keys(METHOD_LABELS) as RedemptionMethod[]).map((method) => (
              <option key={method} value={method}>
                {METHOD_LABELS[method]}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            size={18}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        </div>
      </div>
    </Section>
  );
}

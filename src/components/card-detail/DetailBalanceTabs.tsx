'use client';

import { Segmented } from '@/components/ui/Segmented';

export type DetailBalanceTab = 'details' | 'balance';

interface DetailBalanceTabsProps {
  value: DetailBalanceTab;
  onChange: (value: DetailBalanceTab) => void;
}

export function DetailBalanceTabs({ value, onChange }: DetailBalanceTabsProps) {
  return (
    <div className="px-5">
      <Segmented
        aria-label="Card detail tabs"
        options={[
          { value: 'details', label: 'Details' },
          { value: 'balance', label: 'Balance' },
        ]}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

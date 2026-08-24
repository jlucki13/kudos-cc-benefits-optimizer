import { Section } from '@/components/ui/Section';

interface RatesAndFeesProps {
  annualFeeLabel: string;
  aprLabel: string;
  foreignTxFeeLabel: string;
}

export function RatesAndFees({ annualFeeLabel, aprLabel, foreignTxFeeLabel }: RatesAndFeesProps) {
  const rows = [
    ['Annual Fee', annualFeeLabel],
    ['Ongoing APR', aprLabel],
    ['Foreign Transaction Fee', foreignTxFeeLabel],
  ] as const;
  return (
    <Section title="Rates and fees">
      <dl className="divide-y divide-neutral-100 px-5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-[15px] text-neutral-500">{label}</dt>
            <dd className="text-right text-[15px] font-semibold text-neutral-900">{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

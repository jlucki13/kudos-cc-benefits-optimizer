import { Chip } from '@/components/ui/Chip';
import { Section } from '@/components/ui/Section';
import { CheckIcon, LockIcon, XIcon } from '@/components/ui/icons';

interface AnnualFeePanelProps {
  annualFeeLabel: string;
  /**
   * v1 has no bank sync, so the compare CTA ships visibly disabled with an
   * honest caption. Flip this off only once a real connect flow exists.
   */
  disabled?: boolean;
}

export function AnnualFeePanel({ annualFeeLabel, disabled = true }: AnnualFeePanelProps) {
  return (
    <Section
      title="Annual fee"
      icon={<LockIcon size={13} />}
      right={<span className="text-[13px] font-medium text-neutral-400">Connect your account</span>}
    >
      <div className="px-5 pt-1">
        <p className="text-[15px] text-neutral-900">
          Your annual fee of <strong className="font-semibold">{annualFeeLabel}</strong> will be billed soon
        </p>
        <div className="mt-4 rounded-2xl bg-[#EFEBFB] p-5">
          <div className="mx-auto w-52 max-w-full rounded-xl bg-white p-3.5 shadow-[0_2px_10px_rgba(30,20,80,0.08)]">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-neutral-500">Last year</span>
              <Chip tone="green">
                <CheckIcon size={11} strokeWidth={3} />
                Yes
              </Chip>
            </div>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[13px] font-medium text-neutral-500">This year</span>
              <Chip tone="red">
                <XIcon size={11} strokeWidth={3} />
                No
              </Chip>
            </div>
          </div>
          <h3 className="mt-4 text-center text-[17px] font-bold text-neutral-900">
            Is the annual fee worth paying for?
          </h3>
          <p className="mt-1.5 text-center text-[13px] leading-5 text-neutral-600">
            Once your account is connected, we&apos;ll compare the value you actually redeem against your{' '}
            {annualFeeLabel} fee — and tell you when the math stops working.
          </p>
          <button
            type="button"
            disabled={disabled}
            aria-disabled={disabled}
            className="mt-4 h-12 w-full rounded-full bg-neutral-900 text-[15px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Connect account to compare
          </button>
          {disabled ? (
            <p className="mt-2 text-center text-[12px] text-neutral-500">
              Account sync is coming in a future update.
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

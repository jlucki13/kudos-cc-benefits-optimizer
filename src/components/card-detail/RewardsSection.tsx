import type { RewardRateVM } from '@/lib/view-models';
import { Section } from '@/components/ui/Section';

interface RewardsSectionProps {
  rewards: RewardRateVM[];
}

/** Multiplier + category as a lavender highlight pill, description in grey below. */
export function RewardsSection({ rewards }: RewardsSectionProps) {
  return (
    <Section title="Rewards">
      <ul className="space-y-5 px-5 pt-1">
        {rewards.map((reward) => (
          <li key={`${reward.multiplierLabel}-${reward.category}`}>
            <p className="text-[15px] leading-[1.9]">
              <span className="rounded-lg bg-[#EFEBFB] px-2 py-1 box-decoration-clone">
                <span className="font-bold text-[#6C5CE7]">{reward.multiplierLabel}</span>{' '}
                <span className="font-medium text-neutral-900">{reward.category}</span>
              </span>
            </p>
            <p className="mt-1.5 text-[13px] leading-5 text-neutral-500">{reward.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

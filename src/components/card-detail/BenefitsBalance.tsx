import { Section } from '@/components/ui/Section';
import { formatCents, formatCentsSigned } from '@/lib/format';
import type { CardRoiVM } from '@/lib/view-models';

interface BenefitsBalanceProps {
  roi: CardRoiVM;
  cardShortName: string;
}

interface LineProps {
  label: string;
  hint: string;
  value: string;
  tone?: 'neutral' | 'positive' | 'danger' | 'muted';
}

const TONES = {
  neutral: 'text-neutral-900',
  positive: 'text-emerald-600',
  danger: 'text-red-600',
  muted: 'text-neutral-400',
} as const;

function Line({ label, hint, value, tone = 'neutral' }: LineProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 py-3">
      <div className="min-w-0">
        <div className="text-[15px] font-medium text-neutral-900">{label}</div>
        <div className="text-[12px] leading-snug text-neutral-400">{hint}</div>
      </div>
      <div className={`shrink-0 text-[15px] font-semibold tabular-nums ${TONES[tone]}`}>{value}</div>
    </div>
  );
}

/**
 * What this card's benefits are worth against its annual fee.
 *
 * This is a deliberate reinterpretation of the "Balance" tab. Showing an
 * account balance needs a bank connection that does not exist yet, so rather
 * than a dead tab this answers the question the app is actually equipped to
 * answer: of the credits attached to this card, how much have you taken, how
 * much can you still take, and how much is already gone.
 */
export function BenefitsBalance({ roi, cardShortName }: BenefitsBalanceProps) {
  const underwater = roi.netCents < 0;

  return (
    <div className="mt-6 space-y-6">
      <div className="mx-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="text-[13px] text-neutral-500">Net so far this year</div>
        <div
          className={`mt-1 text-[34px] font-bold leading-none tabular-nums ${
            underwater ? 'text-neutral-900' : 'text-emerald-600'
          }`}
        >
          {formatCentsSigned(roi.netCents)}
        </div>
        <p className="mt-2 text-[13px] leading-snug text-neutral-500">
          {formatCents(roi.capturedCents)} claimed against a {formatCents(roi.annualFeeCents)} annual
          fee.{' '}
          {roi.claimableNowCents > 0 ? (
            <>
              Use everything still open and {cardShortName} ends at{' '}
              <span className="font-semibold text-emerald-600">
                {formatCentsSigned(roi.projectedNetCents)}
              </span>
              .
            </>
          ) : (
            'Nothing further is claimable right now.'
          )}
        </p>
      </div>

      <Section title="Benefits balance">
        <div className="divide-y divide-neutral-100 bg-white">
          <Line
            label="Claimed"
            hint="Credits you have marked as used"
            value={formatCents(roi.capturedCents)}
            tone="positive"
          />
          <Line
            label="Claimable now"
            hint="Open periods you can still use"
            value={formatCents(roi.claimableNowCents)}
          />
          <Line
            label="Expired unused"
            hint="Periods that closed before you used them"
            value={formatCents(roi.forfeitedCents)}
            tone={roi.forfeitedCents > 0 ? 'danger' : 'muted'}
          />
          <Line
            label="Not yet open"
            hint="Periods that start later this year"
            value={formatCents(roi.unopenedCents)}
            tone="muted"
          />
          <Line
            label="Annual fee"
            hint="What the card costs to hold"
            value={`-${formatCents(roi.annualFeeCents)}`}
          />
        </div>
      </Section>

      <p className="px-5 pb-2 text-center text-[12px] leading-snug text-neutral-400">
        Counts statement credits and points grants only. Spend thresholds and perks are shown on the
        Details tab and are never converted to dollars. Credits on a multi-year cycle count in full
        during the cycle you can claim them.
      </p>
    </div>
  );
}

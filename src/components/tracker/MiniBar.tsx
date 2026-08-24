/**
 * Minimal progress bar. W3 owns the shared ui/ProgressBar primitive; this is a
 * deliberately local duplicate so W4 screens never touch W3's files — dedupe later.
 */
export type MiniBarTone = 'accent' | 'positive' | 'danger' | 'neutral';

const FILL: Record<MiniBarTone, string> = {
  accent: 'bg-accent',
  positive: 'bg-positive',
  danger: 'bg-danger/60',
  neutral: 'bg-ink-tertiary',
};

export default function MiniBar({ percent, tone = 'accent' }: { percent: number; tone?: MiniBarTone }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/6">
      <div className={`h-full rounded-full ${FILL[tone]}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

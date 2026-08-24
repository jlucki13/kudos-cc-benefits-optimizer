interface ProgressBarProps {
  /** 0-100; clamped. */
  percent: number;
  className?: string;
}

/** Thin purple progress bar for benefit usage. */
export function ProgressBar({ percent, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1 w-full overflow-hidden rounded-full bg-neutral-200 ${className}`}
    >
      <div className="h-full rounded-full bg-[#6C5CE7]" style={{ width: `${clamped}%` }} />
    </div>
  );
}

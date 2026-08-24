'use client';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  'aria-label'?: string;
}

/** iOS-style segmented control: grey track, elevated white active segment. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = '',
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div role="tablist" aria-label={ariaLabel} className={`flex rounded-[14px] bg-[#F2F2F7] p-1 ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`h-9 min-w-0 flex-1 rounded-[10px] text-[14px] transition-colors ${
              active
                ? 'bg-white font-semibold text-neutral-900 shadow-[0_1px_5px_rgba(0,0,0,0.12)]'
                : 'font-medium text-neutral-500'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

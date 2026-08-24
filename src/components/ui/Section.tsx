import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  icon?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A titled block: small grey header row (optional icon + right accessory), then content. */
export function Section({ title, icon, right, children, className = '' }: SectionProps) {
  return (
    <section className={className}>
      <div className="mb-1 flex items-center justify-between gap-3 px-5">
        <h2 className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-neutral-400">
          {icon}
          <span className="truncate">{title}</span>
        </h2>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

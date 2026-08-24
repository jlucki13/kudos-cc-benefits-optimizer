import type { ReactNode } from 'react';

interface RowProps {
  left?: ReactNode;
  right?: ReactNode;
  align?: 'start' | 'center';
  className?: string;
  children: ReactNode;
}

/** Generic list row: fixed left slot, flexible middle column, fixed right accessory. */
export function Row({ left, right, align = 'center', className = '', children }: RowProps) {
  return (
    <div className={`flex gap-3 ${align === 'start' ? 'items-start' : 'items-center'} ${className}`}>
      {left ? <div className="shrink-0">{left}</div> : null}
      <div className="min-w-0 flex-1">{children}</div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

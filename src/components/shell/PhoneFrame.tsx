import type { ReactNode } from 'react';

import BottomNav from '@/components/shell/BottomNav';

/**
 * Centers the app at phone width. On desktop it renders a subtle device frame;
 * on mobile it is the full screen. Content scrolls inside the frame so the
 * floating bottom nav can stay pinned within the "device".
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full justify-center bg-app-bg sm:items-center sm:bg-[#e4e4ea] sm:py-6">
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-app-bg sm:h-[min(calc(100dvh-3rem),920px)] sm:rounded-[2.75rem] sm:border-[10px] sm:border-[#141417] sm:shadow-[0_30px_80px_rgba(17,17,25,0.35)]">
        <main className="no-scrollbar flex-1 overflow-y-auto pb-32">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}

import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import PhoneFrame from '@/components/shell/PhoneFrame';

import './globals.css';

export const metadata: Metadata = {
  title: 'Kudos CC Benefits Optimizer',
  description: 'Track and maximize your credit card benefits.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f2f2f7',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-app-bg font-sans text-ink antialiased">
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}

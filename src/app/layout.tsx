import type { Metadata } from 'next';
import 'antd/dist/reset.css';

import { AntdProvider } from '@/components/providers/antd-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Lianchuan Motion Commerce',
  description: 'Industrial-grade motion components storefront and operations console.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import 'antd/dist/reset.css';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AntdProvider } from '@/components/providers/antd-provider';
import { JsonLdScript } from '@/components/seo/json-ld';
import { ToastProvider } from '@C/toast';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildMetadata, buildOrganizationJsonLd } from '@/lib/seo';

import './globals.css';
import './design-system.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = buildMetadata();

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const preferences = await getServerSitePreferences();

  return (
    <html lang={preferences.locale}>
      <body className={`${inter.variable} ${interTight.variable} ${jetBrainsMono.variable}`} data-currency={preferences.currency} data-unit-system={preferences.unitSystem}>
        <JsonLdScript id="organization-jsonld" data={buildOrganizationJsonLd()} />
        <AntdProvider>
          <ToastProvider>{children}</ToastProvider>
        </AntdProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { ReactNode } from 'react';

import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Checkout — STEPMOTECH',
  description: 'Secure checkout and order confirmation.',
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
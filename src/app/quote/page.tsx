import { cookies } from 'next/headers';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { buildMetadata } from '@/lib/seo';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { getCurrentUserId } from '@/server/auth/session';
import { getProductList } from '@/server/storefront';
import { getActiveCartDetail } from '@/server/storefront/cart';

import { QuoteClient } from './quote-client';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();
  return buildMetadata({
  title: 'Request for Quote — STEPMOTECH',
  description: 'Collect multi-line RFQ demand with project context, attachments, and buyer details in a dedicated quote workflow.',
  path: '/quote',
  noIndex: true,
    locale,
  });
}

export default async function QuotePage() {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();
  const { locale } = await getServerSitePreferences();
  const anonymousToken = cookieStore.get('cart_token')?.value ?? null;

  const [cart, catalog] = await Promise.all([
    getActiveCartDetail({ userId, anonymousToken }),
    getProductList({ pageSize: 96, sort: 'featured' }),
  ]);
  const intakeProduct = catalog.items[0] ?? null;

  if (!intakeProduct) {
    return null;
  }

  return (
    <StorefrontFrame
      eyebrow="RFQ"
      title="Request for Quote"
      description="Capture project context, line items, compliance notes, and buyer details in one RFQ page instead of routing complex demand through general contact."
    >
      <section className="section">
        <div className="section-inner">
          <QuoteClient
            locale={locale}
            intakeProductId={intakeProduct.id}
            intakeProductName={intakeProduct.name}
            cart={cart}
            catalogProducts={catalog.items}
          />
        </div>
      </section>
    </StorefrontFrame>
  );
}
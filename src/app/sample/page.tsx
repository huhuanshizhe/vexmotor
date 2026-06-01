import { cookies } from 'next/headers';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { buildMetadata } from '@/lib/seo';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { getCurrentUserId } from '@/server/auth/session';
import { getProductList } from '@/server/storefront';
import { getActiveCartDetail } from '@/server/storefront/cart';

import { SampleClient } from './sample-client';

export const metadata = buildMetadata({
  title: 'Request Samples — STEPMOTECH',
  description: 'Request engineering samples with per-SKU limits, shipping selection, and buyer contact details.',
  path: '/sample',
  noIndex: true,
});

export default async function SamplePage() {
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
      eyebrow="Samples"
      title="Request Samples"
      description="A dedicated sample-request page keeps engineering validation lightweight while still capturing buyer context, address, and courier choice."
    >
      <section className="section">
        <div className="section-inner">
          <SampleClient locale={locale} intakeProductId={intakeProduct.id} intakeProductName={intakeProduct.name} cart={cart} catalogProducts={catalog.items} />
        </div>
      </section>
    </StorefrontFrame>
  );
}
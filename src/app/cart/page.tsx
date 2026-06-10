import { cookies } from 'next/headers';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildMetadata } from '@/lib/seo';
import { getCurrentUserId } from '@/server/auth/session';
import { getCommerceConfig } from '@/server/commerce/config';
import { getActiveCartDetail } from '@/server/storefront/cart';
import { getHomeData } from '@/server/storefront';

import { CartClient } from './cart-client';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();
  return buildMetadata({
  title: 'Cart — STEPMOTECH',
  description: 'Review line items before checkout or quote submission.',
  path: '/cart',
  noIndex: true,
    locale,
  });
}

export default async function CartPage() {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();
  const { locale } = await getServerSitePreferences();
  const anonymousToken = cookieStore.get('cart_token')?.value ?? null;
  const [cart, homeData, commerceConfig] = await Promise.all([
    getActiveCartDetail({ userId, anonymousToken }),
    getHomeData(),
    getCommerceConfig(),
  ]);

  return (
    <StorefrontFrame>
      <section className="section">
        <div className="section-inner">
          <CartClient
            initialCart={cart}
            locale={locale}
            hasAccountContext={Boolean(userId)}
            crossSellProducts={homeData.mostViewedProducts.slice(0, 3)}
            emptyStateCategories={homeData.featuredCategories.slice(0, 3)}
            commerceConfig={commerceConfig}
          />
        </div>
      </section>
    </StorefrontFrame>
  );
}

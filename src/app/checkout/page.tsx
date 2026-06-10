import Link from 'next/link';
import { cookies } from 'next/headers';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildMetadata } from '@/lib/seo';
import { getCurrentUserId } from '@/server/auth/session';
import { getCommerceConfig } from '@/server/commerce/config';
import { getAddressesByUser } from '@/server/storefront/account';
import { getActiveCartDetail } from '@/server/storefront/cart';

import { CheckoutClient } from './checkout-client';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();
  return buildMetadata({
  title: 'Checkout — STEPMOTECH',
  description: 'Secure one-page checkout for direct-buy orders.',
  path: '/checkout',
  noIndex: true,
    locale,
  });
}

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();
  const preferences = await getServerSitePreferences();
  const anonymousToken = cookieStore.get('cart_token')?.value ?? null;

  const [cart, addresses, commerceConfig] = await Promise.all([
    getActiveCartDetail({ userId, anonymousToken }),
    userId ? getAddressesByUser(userId) : Promise.resolve([]),
    getCommerceConfig(),
  ]);

  if (!cart || !cart.items.length) {
    return (
      <StorefrontFrame>
        <section className="section">
          <div className="section-inner">
            <article className="info-card">
              <h2 style={{ marginTop: 0 }}>Your cart is empty</h2>
              <p className="section-description">Add at least one direct-buy product before checking out.</p>
              <Link href={withLocalePath('/products', preferences.locale)} className="button-primary">Browse Products</Link>
            </article>
          </div>
        </section>
      </StorefrontFrame>
    );
  }

  if (userId && !addresses.length) {
    return (
      <StorefrontFrame>
        <section className="section">
          <div className="section-inner">
            <article className="info-card">
              <h2 style={{ marginTop: 0 }}>Add an address first</h2>
              <p className="section-description">Checkout uses your saved address book for shipping and billing.</p>
              <Link href={withLocalePath('/account/addresses', preferences.locale)} className="button-primary">Manage Addresses</Link>
            </article>
          </div>
        </section>
      </StorefrontFrame>
    );
  }

  return (
    <StorefrontFrame>
      <section className="section">
        <div className="section-inner">
          <CheckoutClient cart={cart} addresses={addresses} guestMode={!userId} commerceConfig={commerceConfig} />
        </div>
      </section>
    </StorefrontFrame>
  );
}

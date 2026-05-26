import Link from 'next/link';
import { cookies } from 'next/headers';

import { getCurrentUserId } from '@/server/auth/session';
import { getAddressesByUser } from '@/server/storefront/account';
import { getActiveCartDetail } from '@/server/storefront/cart';

import { CheckoutClient } from './checkout-client';

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();

  if (!userId) {
    return (
      <main className="storefront-shell">
        <section className="section">
          <div className="section-inner">
            <article className="info-card">
              <h1 className="section-title">Checkout requires sign-in</h1>
              <p className="section-description">Addresses and orders are linked to a member account, so please sign in before placing an order.</p>
              <Link href="/login?callbackUrl=/checkout" className="button-primary">Go to Login</Link>
            </article>
          </div>
        </section>
      </main>
    );
  }

  const [cart, addresses] = await Promise.all([
    getActiveCartDetail({ userId, anonymousToken: cookieStore.get('cart_token')?.value ?? null }),
    getAddressesByUser(userId),
  ]);

  if (!cart || !cart.items.length) {
    return (
      <main className="storefront-shell">
        <section className="section">
          <div className="section-inner">
            <article className="info-card">
              <h1 className="section-title">Your cart is empty</h1>
              <p className="section-description">Add at least one direct-buy product before checking out.</p>
              <Link href="/products" className="button-primary">Browse Products</Link>
            </article>
          </div>
        </section>
      </main>
    );
  }

  if (!addresses.length) {
    return (
      <main className="storefront-shell">
        <section className="section">
          <div className="section-inner">
            <article className="info-card">
              <h1 className="section-title">Add an address first</h1>
              <p className="section-description">Checkout now uses your saved address book for shipping and billing snapshots.</p>
              <Link href="/account/addresses" className="button-primary">Manage Addresses</Link>
            </article>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Checkout</h1>
              <p className="section-description">This flow now writes a real order, order items, and address snapshots into PostgreSQL.</p>
            </div>
          </div>
          <CheckoutClient cart={cart} addresses={addresses} />
        </div>
      </section>
    </main>
  );
}

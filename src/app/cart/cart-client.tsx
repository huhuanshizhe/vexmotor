'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

type Money = {
  currency: string;
  amount: number;
  formatted: string;
};

type CartDetail = {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: Money;
    subtotal: Money;
    product: {
      id: string;
      name: string;
      slug: string;
      sku: string;
      shortDescription?: string | null;
      purchaseMode: 'buy' | 'inquiry';
      inStock: boolean;
      price: Money;
    };
  }>;
  itemCount: number;
  subtotal: Money;
  shipping: Money;
  tax: Money;
  total: Money;
} | null;

export function CartClient({ initialCart }: { initialCart: CartDetail }) {
  const [cart, setCart] = useState<CartDetail>(initialCart);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateQuantity(itemId: string, quantity: number) {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch(`/api/front/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        setMessage('Unable to update cart quantity.');
        return;
      }

      const nextCart = (await response.json()) as CartDetail;
      setCart(nextCart);
    });
  }

  function removeItem(itemId: string) {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch(`/api/front/cart/items/${itemId}`, { method: 'DELETE' });
      if (!response.ok) {
        setMessage('Unable to remove cart item.');
        return;
      }

      const detailResponse = await fetch('/api/front/cart', { cache: 'no-store' });
      const nextCart = (await detailResponse.json()) as CartDetail;
      setCart(nextCart);
    });
  }

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Cart</h1>
              <p className="section-description">Review quantities, confirm commercial totals, and move into the address-backed checkout flow.</p>
            </div>
          </div>
          {!cart || !cart.items.length ? (
            <article className="info-card">
              <h2>Your cart is empty</h2>
              <p className="section-description">Browse catalog products and add a direct-buy item to continue.</p>
              <Link href="/products" className="button-primary">
                Browse Products
              </Link>
            </article>
          ) : (
            <div className="info-grid" style={{ alignItems: 'start' }}>
              <article className="info-card" style={{ display: 'grid', gap: 16 }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{ display: 'grid', gap: 10, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ margin: 0 }}>{item.product.name}</h3>
                        <p className="product-meta">{item.product.sku}</p>
                        <p className="section-description">{item.product.shortDescription}</p>
                      </div>
                      <strong>{item.subtotal.formatted}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      <label>
                        <span className="product-meta">Qty</span>
                        <select
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                          disabled={isPending}
                          style={{ marginLeft: 10, minHeight: 40, borderRadius: 999, padding: '0 12px', border: '1px solid var(--color-border)' }}
                        >
                          {[1, 2, 3, 4, 5, 10].map((qty) => (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button type="button" className="button-secondary" onClick={() => removeItem(item.id)} disabled={isPending} style={{ color: 'var(--color-ink)', borderColor: 'var(--color-border)' }}>
                        Remove
                      </button>
                      <Link href={`/products/${item.product.slug}`} className="nav-link">
                        View product
                      </Link>
                    </div>
                  </div>
                ))}
              </article>
              <article className="info-card" style={{ display: 'grid', gap: 14 }}>
                <h2 style={{ margin: 0 }}>Order Summary</h2>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="section-description">Subtotal</span>
                    <strong>{cart.subtotal.formatted}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="section-description">Shipping</span>
                    <strong>{cart.shipping.formatted}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="section-description">Tax</span>
                    <strong>{cart.tax.formatted}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
                    <span>Total</span>
                    <strong>{cart.total.formatted}</strong>
                  </div>
                </div>
                <Link href="/checkout" className="button-primary">
                  Proceed to Checkout
                </Link>
                <Link href="/products" className="nav-link">
                  Continue shopping
                </Link>
                {message ? <p className="section-description">{message}</p> : null}
              </article>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

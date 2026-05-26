import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCurrentUserId } from '@/server/auth/session';
import { getOrderDetailByNumber } from '@/server/storefront/account';

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const userId = await getCurrentUserId();
  const { orderNumber } = await params;
  const order = userId ? await getOrderDetailByNumber(userId, orderNumber) : null;

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddressSnapshot as Record<string, string | null>;
  const billingAddress = order.billingAddressSnapshot as Record<string, string | null>;

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Order {order.orderNumber}</h1>
              <p className="section-description">Status: {order.status} · Payment: {order.paymentMethod ?? 'Not set'} · Shipping: {order.shippingMethod ?? 'Not set'}</p>
            </div>
            <Link href="/account/orders" className="nav-link">Back to orders</Link>
          </div>
          <div className="info-grid" style={{ alignItems: 'start' }}>
            <article className="info-card" style={{ display: 'grid', gap: 14 }}>
              <h2 style={{ margin: 0 }}>Items</h2>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <strong>{item.productName}</strong>
                    <div className="product-meta">{item.sku} · Qty {item.quantity}</div>
                  </div>
                  <strong>${Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}
              <div style={{ display: 'grid', gap: 8, paddingTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Subtotal</span><strong>${Number(order.subtotal).toFixed(2)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Shipping</span><strong>${Number(order.shippingAmount).toFixed(2)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Tax</span><strong>${Number(order.taxAmount).toFixed(2)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><strong>${Number(order.totalAmount).toFixed(2)}</strong></div>
              </div>
            </article>
            <article className="info-card" style={{ display: 'grid', gap: 18 }}>
              <div>
                <h2 style={{ marginTop: 0 }}>Shipping Address</h2>
                <div className="section-description">
                  <div>{shippingAddress.firstName} {shippingAddress.lastName}</div>
                  <div>{shippingAddress.addressLine1}</div>
                  {shippingAddress.addressLine2 ? <div>{shippingAddress.addressLine2}</div> : null}
                  <div>{shippingAddress.city} {shippingAddress.postalCode}</div>
                  <div>{shippingAddress.countryCode}</div>
                </div>
              </div>
              <div>
                <h2 style={{ marginTop: 0 }}>Billing Address</h2>
                <div className="section-description">
                  <div>{billingAddress.firstName} {billingAddress.lastName}</div>
                  <div>{billingAddress.addressLine1}</div>
                  {billingAddress.addressLine2 ? <div>{billingAddress.addressLine2}</div> : null}
                  <div>{billingAddress.city} {billingAddress.postalCode}</div>
                  <div>{billingAddress.countryCode}</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

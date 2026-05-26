import Link from 'next/link';

import { getCurrentUserId } from '@/server/auth/session';
import { getOrdersByUser } from '@/server/storefront/account';

export default async function AccountOrdersPage() {
  const userId = await getCurrentUserId();
  const orders = userId ? await getOrdersByUser(userId) : [];

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Orders</h1>
              <p className="section-description">Track every order written by the checkout flow, including totals, payment method, and shipment snapshots.</p>
            </div>
          </div>
          {!orders.length ? (
            <article className="info-card">
              <h2>No orders yet</h2>
              <p className="section-description">Your completed checkouts will appear here.</p>
              <Link href="/products" className="button-primary">Start Shopping</Link>
            </article>
          ) : (
            <div className="info-grid">
              {orders.map((order) => (
                <article key={order.id} className="info-card" style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0 }}>{order.orderNumber}</h2>
                    <span className="product-badge">{order.status}</span>
                  </div>
                  <p className="section-description">Placed: {order.placedAt ? new Date(order.placedAt).toLocaleString() : 'Pending'}</p>
                  <p className="section-description">Payment: {order.paymentMethod ?? 'Not set'}</p>
                  <p className="product-price">${Number(order.totalAmount).toFixed(2)}</p>
                  <Link href={`/account/orders/${order.orderNumber}`} className="nav-link">View order details</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

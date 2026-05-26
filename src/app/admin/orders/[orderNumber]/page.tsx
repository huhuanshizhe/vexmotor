import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAdminOrderDetail } from '@/server/admin/orders';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getAdminOrderDetail(orderNumber);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddressSnapshot as Record<string, string | null>;
  const billingAddress = order.billingAddressSnapshot as Record<string, string | null>;

  return (
    <main style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0 }}>Order {order.orderNumber}</h1>
          <p style={{ margin: '8px 0 0', color: '#677489' }}>{order.customerName} {order.customerLastName} · {order.customerEmail}</p>
        </div>
        <Link href="/admin/orders">Back to Orders</Link>
      </div>
      <div className="info-grid">
        <article className="info-card">
          <h2 style={{ marginTop: 0 }}>Commercial Summary</h2>
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentMethod ?? 'Not set'}</p>
          <p>Shipping: {order.shippingMethod ?? 'Not set'}</p>
          <p>Placed: {order.placedAt ? new Date(order.placedAt).toLocaleString() : 'Pending'}</p>
          <p>Customer Note: {order.customerNote ?? 'None'}</p>
        </article>
        <article className="info-card">
          <h2 style={{ marginTop: 0 }}>Totals</h2>
          <p>Subtotal: ${Number(order.subtotal).toFixed(2)}</p>
          <p>Shipping: ${Number(order.shippingAmount).toFixed(2)}</p>
          <p>Tax: ${Number(order.taxAmount).toFixed(2)}</p>
          <p><strong>Total: ${Number(order.totalAmount).toFixed(2)}</strong></p>
        </article>
      </div>
      <div className="info-grid">
        <article className="info-card">
          <h2 style={{ marginTop: 0 }}>Shipping Address</h2>
          <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 ? <p>{shippingAddress.addressLine2}</p> : null}
          <p>{shippingAddress.city} {shippingAddress.postalCode}</p>
          <p>{shippingAddress.countryCode}</p>
        </article>
        <article className="info-card">
          <h2 style={{ marginTop: 0 }}>Billing Address</h2>
          <p>{billingAddress.firstName} {billingAddress.lastName}</p>
          <p>{billingAddress.addressLine1}</p>
          {billingAddress.addressLine2 ? <p>{billingAddress.addressLine2}</p> : null}
          <p>{billingAddress.city} {billingAddress.postalCode}</p>
          <p>{billingAddress.countryCode}</p>
        </article>
      </div>
      <article className="info-card">
        <h2 style={{ marginTop: 0 }}>Items</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <strong>{item.productName}</strong>
                <div style={{ color: '#677489' }}>{item.sku} · Qty {item.quantity}</div>
              </div>
              <strong>${Number(item.subtotal).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}

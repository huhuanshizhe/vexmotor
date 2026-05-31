import Link from 'next/link';
import { notFound } from 'next/navigation';

import { parseOrderNote } from '@/lib/order-note';
import { getCurrentUserId } from '@/server/auth/session';
import { getOrderDetailByNumber } from '@/server/storefront/account';

export default async function AccountOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ action?: string }>;
}) {
  const userId = await getCurrentUserId();
  const [{ orderNumber }, { action }] = await Promise.all([params, searchParams]);
  const order = userId ? await getOrderDetailByNumber(userId, orderNumber) : null;
  const rmaMode = action === 'rma';

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddressSnapshot as Record<string, string | null>;
  const billingAddress = order.billingAddressSnapshot as Record<string, string | null>;
  const parsedNote = parseOrderNote(order.customerNote);

  return (
    <div className="account-panel-stack">
      <div className="section-header">
        <div>
          <h1 className="section-title">Order {order.orderNumber}</h1>
          <p className="section-description">Status: {order.status} · Payment: {order.paymentMethod ?? 'Not set'} · Shipping: {order.shippingMethod ?? 'Not set'}</p>
        </div>
        <Link href="/account/orders" className="nav-link">Back to orders</Link>
      </div>
      {rmaMode ? (
        <article className="info-card" style={{ display: 'grid', gap: 14 }}>
          <div>
            <div className="card-kicker">Return / Warranty Request</div>
            <h2 style={{ margin: '6px 0 0' }}>RMA handoff for order {order.orderNumber}</h2>
          </div>
          <div className="support-list">
            <div className="support-item">
              <span className="support-bullet" />
              <span>Confirm which line item is affected and whether the issue is defect, wrong item, shipping damage, or warranty review.</span>
            </div>
            <div className="support-item">
              <span className="support-bullet" />
              <span>Prepare photos or video, packaging evidence, and any setup notes before contacting support.</span>
            </div>
            <div className="support-item">
              <span className="support-bullet" />
              <span>Do not ship product back until the support team confirms the receiving lane and RMA handling path.</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/support/contact?topic=order-issue" className="button-primary">Contact Order Support</Link>
            <Link href="/support/returns" className="button-secondary">Review Returns & Warranty</Link>
          </div>
        </article>
      ) : null}
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
            {Number(order.discountAmount) > 0 ? <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Discount</span><strong>-${Number(order.discountAmount).toFixed(2)}</strong></div> : null}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Shipping</span><strong>${Number(order.shippingAmount).toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Tax</span><strong>${Number(order.taxAmount).toFixed(2)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><strong>${Number(order.totalAmount).toFixed(2)}</strong></div>
          </div>
          {parsedNote.narrative ? (
            <div style={{ display: 'grid', gap: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: 0 }}>Buyer Note</h3>
              <p className="section-description" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {parsedNote.narrative}
              </p>
            </div>
          ) : null}

          {parsedNote.poNumber || parsedNote.taxId || parsedNote.requestedShipDate || parsedNote.tradeTerm ? (
            <div className="info-grid" style={{ paddingTop: 8 }}>
              {parsedNote.poNumber ? <article className="info-card"><h3 style={{ marginTop: 0 }}>PO Number</h3><p style={{ marginBottom: 0 }}>{parsedNote.poNumber}</p></article> : null}
              {parsedNote.taxId ? <article className="info-card"><h3 style={{ marginTop: 0 }}>Tax ID / VAT</h3><p style={{ marginBottom: 0 }}>{parsedNote.taxId}</p></article> : null}
              {parsedNote.requestedShipDate ? <article className="info-card"><h3 style={{ marginTop: 0 }}>Requested Ship Date</h3><p style={{ marginBottom: 0 }}>{parsedNote.requestedShipDate}</p></article> : null}
              {parsedNote.tradeTerm ? <article className="info-card"><h3 style={{ marginTop: 0 }}>Trade Term</h3><p style={{ marginBottom: 0 }}>{parsedNote.tradeTerm}</p></article> : null}
            </div>
          ) : null}
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
  );
}

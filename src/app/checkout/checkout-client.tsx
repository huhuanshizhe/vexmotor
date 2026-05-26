'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

type Money = {
  currency: string;
  amount: number;
  formatted: string;
};

type CartDetail = {
  items: Array<{ id: string; quantity: number; product: { name: string; sku: string }; subtotal: Money }>;
  subtotal: Money;
  shipping: Money;
  tax: Money;
  total: Money;
};

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  phone: string | null;
  countryCode: string;
  state: string | null;
  city: string;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  isDefault: boolean;
};

export function CheckoutClient({ cart, addresses }: { cart: CartDetail; addresses: Address[] }) {
  const router = useRouter();
  const defaultAddressId = useMemo(() => addresses.find((item) => item.isDefault)?.id ?? addresses[0]?.id ?? '', [addresses]);
  const [shippingAddressId, setShippingAddressId] = useState(defaultAddressId);
  const [billingAddressId, setBillingAddressId] = useState(defaultAddressId);
  const [shippingMethod, setShippingMethod] = useState('Express Air');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [customerNote, setCustomerNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function placeOrder() {
    startTransition(async () => {
      setMessage(null);
      const response = await fetch('/api/front/checkout/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddressId, billingAddressId, shippingMethod, paymentMethod, customerNote }),
      });

      if (!response.ok) {
        setMessage('Unable to place order. Please verify cart and address data.');
        return;
      }

      const order = (await response.json()) as { orderNumber: string };
      router.push(`/account/orders/${order.orderNumber}`);
      router.refresh();
    });
  }

  return (
    <div className="info-grid" style={{ alignItems: 'start' }}>
      <article className="info-card" style={{ display: 'grid', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Shipping & Billing</h2>
        <label style={{ display: 'grid', gap: 8 }}>
          <span className="product-meta">Shipping address</span>
          <select value={shippingAddressId} onChange={(event) => setShippingAddressId(event.target.value)} style={{ minHeight: 44, borderRadius: 14, border: '1px solid var(--color-border)', padding: '0 12px' }}>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.firstName} {address.lastName} · {address.city} · {address.addressLine1}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 8 }}>
          <span className="product-meta">Billing address</span>
          <select value={billingAddressId} onChange={(event) => setBillingAddressId(event.target.value)} style={{ minHeight: 44, borderRadius: 14, border: '1px solid var(--color-border)', padding: '0 12px' }}>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.firstName} {address.lastName} · {address.city} · {address.addressLine1}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'grid', gap: 8 }}>
          <span className="product-meta">Shipping method</span>
          <select value={shippingMethod} onChange={(event) => setShippingMethod(event.target.value)} style={{ minHeight: 44, borderRadius: 14, border: '1px solid var(--color-border)', padding: '0 12px' }}>
            <option value="Express Air">Express Air</option>
            <option value="Ocean Freight">Ocean Freight</option>
            <option value="Courier DDP">Courier DDP</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: 8 }}>
          <span className="product-meta">Payment method</span>
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} style={{ minHeight: 44, borderRadius: 14, border: '1px solid var(--color-border)', padding: '0 12px' }}>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: 8 }}>
          <span className="product-meta">Customer note</span>
          <textarea value={customerNote} onChange={(event) => setCustomerNote(event.target.value)} rows={5} style={{ borderRadius: 18, border: '1px solid var(--color-border)', padding: 14, font: 'inherit' }} />
        </label>
      </article>
      <article className="info-card" style={{ display: 'grid', gap: 14 }}>
        <h2 style={{ margin: 0 }}>Checkout Summary</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {cart.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <strong>{item.product.name}</strong>
                <div className="product-meta">{item.product.sku} · Qty {item.quantity}</div>
              </div>
              <strong>{item.subtotal.formatted}</strong>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 8, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Subtotal</span><strong>{cart.subtotal.formatted}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Shipping</span><strong>{cart.shipping.formatted}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="section-description">Tax</span><strong>{cart.tax.formatted}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><strong>{cart.total.formatted}</strong></div>
        </div>
        <button type="button" className="button-primary" onClick={placeOrder} disabled={isPending || !shippingAddressId || !billingAddressId}>
          {isPending ? 'Submitting...' : 'Place Order'}
        </button>
        {message ? <p className="section-description">{message}</p> : null}
      </article>
    </div>
  );
}

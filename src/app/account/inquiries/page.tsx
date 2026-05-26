import Link from 'next/link';

import { getCurrentUserId } from '@/server/auth/session';
import { getInquiriesByUser } from '@/server/storefront/account';

export default async function AccountInquiriesPage() {
  const userId = await getCurrentUserId();
  const items = userId ? await getInquiriesByUser(userId) : [];

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">My Inquiries</h1>
              <p className="section-description">Track every RFQ submitted from the storefront, together with product context and follow-up status.</p>
            </div>
          </div>
          {!items.length ? (
            <article className="info-card">
              <h2>No inquiries submitted</h2>
              <p className="section-description">Inquiry-mode products will write a real record here after submission.</p>
              <Link href="/products" className="button-primary">Browse Catalog</Link>
            </article>
          ) : (
            <div className="info-grid">
              {items.map((item) => (
                <article key={item.id} className="info-card" style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0 }}>{item.productName}</h2>
                    <span className="product-badge">{item.status}</span>
                  </div>
                  <p className="product-meta">{item.productSku}</p>
                  <p className="section-description">{item.message}</p>
                  <p className="section-description">Submitted on {new Date(item.createdAt).toLocaleString()}</p>
                  <Link href={`/products/${item.productSlug}`} className="nav-link">Open product page</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

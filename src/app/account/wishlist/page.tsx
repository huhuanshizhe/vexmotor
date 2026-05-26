import Link from 'next/link';

import { getCurrentUserId } from '@/server/auth/session';
import { getWishlistByUser } from '@/server/storefront/account';

export default async function AccountWishlistPage() {
  const userId = await getCurrentUserId();
  const items = userId ? await getWishlistByUser(userId) : [];

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Wishlist</h1>
              <p className="section-description">Saved products stay here until the buyer is ready to compare, quote, or purchase.</p>
            </div>
          </div>
          {!items.length ? (
            <article className="info-card">
              <h2>No saved products</h2>
              <p className="section-description">Use the wishlist action on product detail pages to keep shortlisted catalog items.</p>
              <Link href="/products" className="button-primary">Browse Products</Link>
            </article>
          ) : (
            <div className="product-grid">
              {items.map((item) => (
                <article key={item.id} className="product-card">
                  <span className="product-badge">{item.purchaseMode === 'buy' ? 'Direct Buy' : 'Inquiry'}</span>
                  <h3><Link href={`/products/${item.slug}`}>{item.name}</Link></h3>
                  <p className="product-meta">{item.sku}</p>
                  <p>{item.shortDescription}</p>
                  <p className="product-price">{new Intl.NumberFormat('en-US', { style: 'currency', currency: item.currencyCode }).format(Number(item.price))}</p>
                  <p className="section-description">Saved on {new Date(item.createdAt).toLocaleDateString()}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { AddToWishlistButton } from '@/components/storefront/add-to-wishlist-button';
import { getProductBySlug } from '@/server/storefront';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="info-grid">
            <article className="info-card">
              <div className="card-kicker">{product.purchaseMode === 'buy' ? 'Direct buy catalog item' : 'RFQ-only item'}</div>
              <h1 className="section-title">{product.name}</h1>
              <p className="product-meta">{product.sku}</p>
              <p className="section-description">{product.description}</p>
              <p className="product-price">{product.purchaseMode === 'buy' ? product.price.formatted : 'Request Quote'}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                {product.purchaseMode === 'buy' ? (
                  <AddToCartButton productId={product.id} />
                ) : (
                  <Link href="/contact" className="button-primary">
                    Submit Inquiry
                  </Link>
                )}
                <AddToWishlistButton productId={product.id} />
                <Link href="/products" className="button-secondary" style={{ color: '#13181f', borderColor: '#d7dce3' }}>
                  Back to Catalog
                </Link>
              </div>
            </article>
            <article className="info-card">
              <h2 style={{ marginTop: 0 }}>Product Data</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {product.features.map((feature) => (
                  <div key={`${feature.key}-${feature.value}`}>
                    <strong>{feature.key}: </strong>
                    <span>
                      {feature.value}
                      {feature.unit ? ` ${feature.unit}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Attachments & Related Products</h2>
              <p className="section-description">This section mirrors the product enrichment pattern from the reference storefront.</p>
            </div>
          </div>
          <div className="info-grid">
            <article className="info-card">
              <h3>Attachments</h3>
              {product.attachments.length ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  {product.attachments.map((attachment) => (
                    <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer" className="nav-link">
                      {attachment.name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="section-description">No attachments are currently attached to this product.</p>
              )}
            </article>
            <article className="info-card">
              <h3>Related Products</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {product.relatedProducts.map((item) => (
                  <Link key={item.id} href={`/products/${item.slug}`} className="nav-link">
                    {item.name}
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

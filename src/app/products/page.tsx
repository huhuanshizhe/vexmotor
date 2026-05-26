import Link from 'next/link';

import { getCategories, getProductList } from '@/server/storefront';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; keyword?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? '1');
  const [categories, listing] = await Promise.all([
    getCategories(),
    getProductList({
      categorySlug: params.category,
      keyword: params.keyword,
      page: Number.isNaN(page) ? 1 : page,
      pageSize: 12,
    }),
  ]);

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Product Catalog</h1>
              <p className="section-description">
                Browse the catalog foundation for the industrial storefront. This page already reads through the shared data layer
                and is ready to switch from seed data to Neon records.
              </p>
            </div>
          </div>
          <div className="info-grid">
            <aside className="info-card">
              <h3>Categories</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                <Link href="/products" className="nav-link">
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.slug}`} className="nav-link">
                    {category.name}
                  </Link>
                ))}
              </div>
            </aside>
            <section>
              <div className="section-header" style={{ marginBottom: 16 }}>
                <div>
                  <h2 className="section-title" style={{ fontSize: '2rem' }}>
                    {listing.meta.total} products
                  </h2>
                  <p className="section-description">
                    Page {listing.meta.page} of {listing.meta.totalPages}
                  </p>
                </div>
              </div>
              <div className="product-grid">
                {listing.items.map((product) => (
                  <article key={product.id} className="product-card">
                    <span className="product-badge">{product.purchaseMode === 'buy' ? 'Direct Buy' : 'Inquiry'}</span>
                    <h3>
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="product-meta">{product.sku}</p>
                    <p>{product.shortDescription}</p>
                    <p className="product-price">{product.price.formatted}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

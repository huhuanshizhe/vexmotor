import Link from 'next/link';

import { getProductList } from '@/server/storefront';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? '1');
  const listing = await getProductList({
    keyword: params.keyword,
    page: Number.isNaN(page) ? 1 : page,
    pageSize: 12,
  });

  return (
    <main className="storefront-shell">
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h1 className="section-title">Search Results</h1>
              <p className="section-description">Keyword: {params.keyword || 'none'} | {listing.meta.total} matching products</p>
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
        </div>
      </section>
    </main>
  );
}

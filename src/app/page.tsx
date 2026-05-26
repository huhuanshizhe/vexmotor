import Link from 'next/link';
import { getHomeData, getNavigationData } from '@/server/storefront';

export default async function HomePage() {
  const [homeData, navigation] = await Promise.all([getHomeData(), getNavigationData()]);
  const hero = homeData.heroBanners[0];

  return (
    <main className="storefront-shell">
      <div className="storefront-topbar">
        <div className="storefront-topbar-inner">
          <span>Industrial motion components with global delivery support.</span>
          <span>Free shipping & duties on orders over $299</span>
        </div>
      </div>
      <header className="storefront-header">
        <nav className="storefront-nav">
          <Link href="/" className="brand-mark">
            <span className="brand-title">Lianchuan Motion</span>
            <span className="brand-subtitle">Precision components for automation teams</span>
          </Link>
          <div className="nav-links">
            {navigation.topLinks.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <Link href="/login" className="nav-link">
              Login
            </Link>
            <Link href="/admin" className="nav-pill">
              Admin
            </Link>
          </div>
        </nav>
      </header>

      <section className="hero-section">
        <div className="section-inner">
          <div className="hero-panel">
            <div className="hero-copy">
              <span className="eyebrow">{hero.eyebrow}</span>
              <h1 className="hero-title">{hero.title}</h1>
              <p className="hero-description">{hero.description}</p>
              <div className="hero-actions">
                <Link href={hero.primaryAction.href} className="button-primary">
                  {hero.primaryAction.label}
                </Link>
                <Link href={hero.secondaryAction.href} className="button-secondary">
                  {hero.secondaryAction.label}
                </Link>
              </div>
            </div>
            <div className="hero-metrics">
              <div className="metric-card">
                <div className="metric-value">20+ years</div>
                <div className="metric-label">Serving automation and OEM teams across global markets.</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">500+</div>
                <div className="metric-label">Catalog and custom motion configurations planned for launch.</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">Buy / Inquiry</div>
                <div className="metric-label">Dual-mode commerce model aligned with industrial sales cycles.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Category Entry Points</h2>
              <p className="section-description">Fast access to the motion product families your buyers compare most often.</p>
            </div>
          </div>
          <div className="category-grid">
            {homeData.featuredCategories.map((category) => (
              <article key={category.id} className="category-card">
                <div className="card-kicker">{category.productCount ?? 0} products</div>
                <h3>{category.name}</h3>
                <p className="product-meta">Industrial catalog route: /products/{category.slug}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Hot Sale</h2>
              <p className="section-description">Launch candidates for the hero catalog based on recurring industrial demand.</p>
            </div>
          </div>
          <div className="product-grid">
            {homeData.hotSale.map((product) => (
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

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Industries</h2>
              <p className="section-description">A content-led industrial sales approach inspired by the reference storefront.</p>
            </div>
          </div>
          <div className="industry-grid">
            {homeData.featuredIndustries.map((item) => (
              <article key={item.title} className="industry-card">
                <h3>{item.title}</h3>
                <p className="section-description">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner info-grid">
          <article className="info-card">
            <h2 className="section-title">Brand credibility block</h2>
            <p className="section-description">
              This project follows the StepMotech / vexmotor pattern of mixing catalog commerce with engineering-trust content,
              making it suitable for OEM, distributors, and direct factory procurement.
            </p>
          </article>
          <article className="newsletter-card">
            <div>
              <h2 className="section-title">Subscribe to product updates</h2>
              <p className="section-description">Collect newsletter leads and RFQ-ready contacts from high-intent industrial buyers.</p>
            </div>
            <form className="newsletter-form">
              <input className="newsletter-input" type="email" placeholder="Enter your business email" />
              <button className="button-primary" type="button">
                Subscribe
              </button>
            </form>
          </article>
        </div>
      </section>

      <footer className="storefront-footer">
        <div className="footer-inner">
          <div className="trust-grid">
            {homeData.trustHighlights.map((item) => (
              <article key={item} className="trust-card">
                <strong>{item}</strong>
              </article>
            ))}
          </div>
          <p className="footer-note">Spec-driven storefront scaffold for the Lianchuan industrial commerce platform.</p>
        </div>
      </footer>
    </main>
  );
}

import Link from 'next/link';

import { NewsletterSignupForm } from '@/components/storefront/newsletter-signup-form';
import { JsonLdScript } from '@/components/seo/json-ld';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-config';
import { filterBlogPosts, getBlogAuthorById, getBlogCatalog, getBlogYears, getMostReadPosts, paginateBlogPosts } from '@/server/content/blog';

type BlogPageProps = {
  searchParams: Promise<{
    q?: string;
    topic?: string;
    industry?: string;
    author?: string;
    year?: string;
    page?: string;
  }>;
};

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();

  return buildMetadata({
    title: 'Engineering Blog — STEPMOTECH',
    description: 'Engineering notes, tutorials, product news, and motion-control field guidance from the STEPMOTECH team.',
    path: '/blog',
    locale,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [{ locale }, params] = await Promise.all([getServerSitePreferences(), searchParams]);
  const catalog = await getBlogCatalog(locale);
  const filters = {
    query: params.q?.trim() || undefined,
    topic: params.topic?.trim() || undefined,
    industry: params.industry?.trim() || undefined,
    author: params.author?.trim() || undefined,
    year: params.year?.trim() || undefined,
  };
  const filteredPosts = filterBlogPosts(catalog, filters);
  const pagination = paginateBlogPosts(filteredPosts, Number(params.page) || 1, catalog.pageSize);
  const years = getBlogYears(catalog);
  const mostReadPosts = getMostReadPosts(catalog);
  const categoryCounts = catalog.topics.map((topic) => ({ topic, count: catalog.posts.filter((post) => post.topic === topic).length }));
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
  ], locale);
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'STEPMOTECH Engineering Blog',
    description: 'Engineering blog posts covering motion-control selection, tuning, documentation, and release updates.',
    url: `${SITE_URL}${withLocalePath('/blog', locale)}`,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'STEPMOTECH',
      url: SITE_URL,
    },
    blogPost: pagination.items.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seoDescription ?? post.summary,
      inLanguage: post.locale,
      articleSection: [post.topic, post.industry],
      keywords: [post.topic, post.industry].join(', '),
      url: `${SITE_URL}${withLocalePath(`/blog/${post.slug}`, locale)}`,
      datePublished: post.publishedAt,
    })),
  };

  function buildBlogHref(overrides: { q?: string | null; topic?: string | null; industry?: string | null; author?: string | null; year?: string | null; page?: string | null }) {
    const query = new URLSearchParams();
    const values = {
      q: overrides.q !== undefined ? overrides.q : params.q,
      topic: overrides.topic !== undefined ? overrides.topic : params.topic,
      industry: overrides.industry !== undefined ? overrides.industry : params.industry,
      author: overrides.author !== undefined ? overrides.author : params.author,
      year: overrides.year !== undefined ? overrides.year : params.year,
      page: overrides.page !== undefined ? overrides.page : params.page,
    };

    if (values.q) query.set('q', values.q);
    if (values.topic) query.set('topic', values.topic);
    if (values.industry) query.set('industry', values.industry);
    if (values.author) query.set('author', values.author);
    if (values.year) query.set('year', values.year);
    if (values.page && values.page !== '1') query.set('page', values.page);

    const href = withLocalePath('/blog', locale);
    const search = query.toString();
    return search ? `${href}?${search}` : href;
  }

  return (
    <>
      <JsonLdScript id="blog-index-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLdScript id="blog-index-jsonld" data={blogJsonLd} />

      <section className="hero-section blog-hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Engineering journal</span>
          <h1>Engineering Blog</h1>
          <p>Field notes, tutorials, tuning checklists, and release updates for motion-control teams that need documentation to stay close to real program work.</p>
          <form action={withLocalePath('/blog', locale)} method="get" className="blog-hero-search">
            <input type="search" name="q" defaultValue={params.q ?? ''} className="newsletter-input" placeholder="Search articles, topics, or authors" aria-label="Search blog articles" />
            {params.topic ? <input type="hidden" name="topic" value={params.topic} /> : null}
            {params.industry ? <input type="hidden" name="industry" value={params.industry} /> : null}
            {params.author ? <input type="hidden" name="author" value={params.author} /> : null}
            {params.year ? <input type="hidden" name="year" value={params.year} /> : null}
            <button type="submit" className="button-primary">Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="section-inner blog-index-shell">
          <div className="blog-index-main">
            <article className="info-card blog-filter-card">
              <div className="section-header trade-card-header">
                <div>
                  <div className="card-kicker">Filters</div>
                  <h2 className="cart-section-title">Refine by topic, market, author, and year</h2>
                </div>
                <Link href={withLocalePath('/blog', locale)} className="section-link">Clear filters</Link>
              </div>

              <div className="blog-topic-chip-row">
                {catalog.topics.map((topic) => {
                  const active = params.topic === topic;
                  return (
                    <Link
                      key={topic}
                      href={buildBlogHref({ topic: active ? null : topic, page: '1' })}
                      className={`blog-topic-chip${active ? ' is-active' : ''}`}
                    >
                      {topic}
                    </Link>
                  );
                })}
              </div>

              <form action={withLocalePath('/blog', locale)} method="get" className="blog-filter-form">
                <input type="hidden" name="q" value={params.q ?? ''} />
                <label>
                  Industry
                  <select name="industry" defaultValue={params.industry ?? ''}>
                    <option value="">All industries</option>
                    {catalog.industries.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Author
                  <select name="author" defaultValue={params.author ?? ''}>
                    <option value="">All authors</option>
                    {catalog.authors.map((author) => (
                      <option key={author.id} value={author.id}>{author.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Year
                  <select name="year" defaultValue={params.year ?? ''}>
                    <option value="">All years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>
                {params.topic ? <input type="hidden" name="topic" value={params.topic} /> : null}
                <button type="submit" className="button-secondary">Apply filters</button>
              </form>
            </article>

            <div className="blog-filter-meta">
              <p className="section-description">{filteredPosts.length} articles matched. Filters persist in the URL, and RSS stays available at <a href="/blog/rss.xml" className="section-link">/blog/rss.xml</a>.</p>
            </div>

            <div className="blog-card-grid">
              {pagination.items.map((post) => {
                const author = getBlogAuthorById(catalog, post.authorId);
                return (
                  <article key={post.slug} className="blog-index-card">
                    <a href={withLocalePath(`/blog/${post.slug}`, locale)} className="blog-card-cover-link">
                      <img src={withLocalePath(`/blog/cover/${post.slug}`, locale)} alt={post.coverAlt} className="blog-card-cover" />
                    </a>
                    <div className="blog-card-body">
                      <div className="blog-card-meta-row">
                        <span className="resource-chip">{post.topic}</span>
                        <span className="product-meta">{post.readMinutes} min read</span>
                        <span className="product-meta">{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <h2>
                        <Link href={withLocalePath(`/blog/${post.slug}`, locale)}>{post.title}</Link>
                      </h2>
                      <p className="section-description">{post.summary}</p>
                      <div className="blog-card-footer">
                        <div>
                          <strong>{author?.name}</strong>
                          <div className="product-meta">{post.industry}</div>
                        </div>
                        <Link href={withLocalePath(`/blog/${post.slug}`, locale)} className="section-link">Read article</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="blog-pagination-row">
              {Array.from({ length: pagination.totalPages }, (_, index) => {
                const pageNumber = String(index + 1);
                const isActive = pagination.page === index + 1;
                return (
                  <Link key={pageNumber} href={buildBlogHref({ page: pageNumber })} className={`blog-topic-chip${isActive ? ' is-active' : ''}`} aria-current={isActive ? 'page' : undefined}>
                    {pageNumber}
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="blog-index-rail">
            <article className="info-card blog-rail-card">
              <div className="card-kicker">Subscribe</div>
              <h2 className="cart-section-title">Get new engineering notes</h2>
              <p className="section-description">The newsletter API already powers the footer flow, so the same subscription path is reused here.</p>
              <NewsletterSignupForm placeholder="Enter your work email" buttonLabel="Subscribe" />
            </article>

            <article className="info-card blog-rail-card">
              <div className="card-kicker">Most read</div>
              <div className="blog-rail-list">
                {mostReadPosts.map((post) => (
                  <Link key={post.slug} href={withLocalePath(`/blog/${post.slug}`, locale)} className="blog-rail-link">
                    <strong>{post.title}</strong>
                    <span>{post.viewCount.toLocaleString()} reads</span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="info-card blog-rail-card">
              <div className="card-kicker">Categories</div>
              <div className="blog-rail-list">
                {categoryCounts.map((entry) => (
                  <Link key={entry.topic} href={buildBlogHref({ topic: entry.topic, page: '1' })} className="blog-rail-link">
                    <strong>{entry.topic}</strong>
                    <span>{entry.count} articles</span>
                  </Link>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}
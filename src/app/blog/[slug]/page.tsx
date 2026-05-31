import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { JsonLdScript } from '@/components/seo/json-ld';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site-config';
import { getBlogAuthorById, getBlogCatalog, getBlogPostBySlug, getRelatedPosts } from '@/server/content/blog';
import { getProductBySlug, type StorefrontProductDetail } from '@/server/storefront';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const catalog = await getBlogCatalog();
  return catalog.posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const { locale } = await getServerSitePreferences();
  const catalog = await getBlogCatalog(locale);
  const post = getBlogPostBySlug(catalog, slug);

  if (!post) {
    return buildMetadata({
      title: 'Engineering Blog — STEPMOTECH',
      description: 'Engineering notes and tutorials.',
      path: '/blog',
      locale,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.seoTitle ?? `${post.title} — STEPMOTECH`,
    description: post.seoDescription ?? post.summary,
    path: `/blog/${post.slug}`,
    locale,
    type: 'article',
    images: [{ url: `/blog/cover/${post.slug}`, alt: post.coverAlt }],
  });
}

function BlogProductCard({ product, locale, eyebrow, body }: { product: StorefrontProductDetail; locale: string; eyebrow: string; body: string }) {
  return (
    <article className="blog-product-card">
      <div className="blog-product-copy">
        <div className="card-kicker">{eyebrow}</div>
        <h3>
          <Link href={withLocalePath(`/products/${product.slug}`, locale)}>{product.name}</Link>
        </h3>
        <p className="product-meta">{product.sku}</p>
        <p className="section-description compact-copy">{body}</p>
      </div>
      <div className="blog-product-actions">
        <p className="product-price">{product.purchaseMode === 'buy' ? product.price.formatted : 'Request Quote'}</p>
        {product.purchaseMode === 'buy' ? (
          <AddToCartButton productId={product.id} redirectToCart={false} />
        ) : (
          <Link href={withLocalePath(`/products/${product.slug}`, locale)} className="button-secondary">Open RFQ</Link>
        )}
      </div>
    </article>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const [{ locale }, { slug }] = await Promise.all([getServerSitePreferences(), params]);
  const catalog = await getBlogCatalog(locale);
  const post = getBlogPostBySlug(catalog, slug);

  if (!post) {
    notFound();
  }

  const author = getBlogAuthorById(catalog, post.authorId);
  const productSlugs = Array.from(new Set(post.relatedProductSlugs.concat(post.sections.flatMap((section) => section.blocks.filter((block) => block.type === 'product').map((block) => block.productSlug)))));
  const products = await Promise.all(productSlugs.map((productSlug) => getProductBySlug(productSlug)));
  const productMap = new Map(products.filter((item): item is StorefrontProductDetail => Boolean(item)).map((product) => [product.slug, product]));
  const relatedPosts = getRelatedPosts(catalog, post);
  const relatedProducts = post.relatedProductSlugs.map((productSlug) => productMap.get(productSlug)).filter((product): product is StorefrontProductDetail => Boolean(product));
  const articleImage = `${SITE_URL}/blog/cover/${post.slug}`;
  const articleUrl = `${SITE_URL}${withLocalePath(`/blog/${post.slug}`, locale)}`;
  const blogUrl = `${SITE_URL}${withLocalePath('/blog', locale)}`;
  const articleKeywords = Array.from(new Set([post.topic, post.industry, ...relatedProducts.map((product) => product.name)])).slice(0, 8);
  const articleAbout = [
    { '@type': 'Thing', name: post.topic },
    { '@type': 'Thing', name: post.industry },
    ...relatedProducts.map((product) => ({
      '@type': 'Product',
      name: product.name,
      sku: product.sku,
      url: `${SITE_URL}${withLocalePath(`/products/${product.slug}`, locale)}`,
    })),
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ], locale);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    alternativeHeadline: post.seoTitle ?? undefined,
    description: post.seoDescription ?? post.summary,
    image: [articleImage],
    inLanguage: post.locale,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: [post.topic, post.industry],
    keywords: articleKeywords.join(', '),
    author: {
      '@type': 'Person',
      name: author?.name ?? 'STEPMOTECH',
    },
    publisher: {
      '@type': 'Organization',
      name: 'STEPMOTECH',
      url: SITE_URL,
    },
    isPartOf: {
      '@type': 'Blog',
      name: 'STEPMOTECH Engineering Blog',
      url: blogUrl,
    },
    about: articleAbout,
    mainEntityOfPage: articleUrl,
  };

  return (
    <>
      <JsonLdScript id={`blog-post-${post.slug}-breadcrumb-jsonld`} data={breadcrumbJsonLd} />
      <JsonLdScript id={`blog-post-${post.slug}-article-jsonld`} data={articleJsonLd} />

      <section className="hero-section blog-post-hero">
        <div className="blog-post-cover-wrap">
          <img src={withLocalePath(`/blog/cover/${post.slug}`, locale)} alt={post.coverAlt} className="blog-post-cover" />
        </div>
        <div className="hero-copy">
          <div className="blog-post-meta-row">
            <span className="resource-chip">{post.topic}</span>
            <span className="product-meta">{post.readMinutes} min read</span>
            <span className="product-meta">{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="product-meta">{author?.name}</span>
          </div>
          <h1>{post.title}</h1>
          <p>{post.lead}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner blog-post-layout">
          <article className="blog-post-main">
            <div className="blog-post-lead">{post.summary}</div>

            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="blog-article-section">
                <h2>{section.title}</h2>
                {section.blocks.map((block, index) => {
                  if (block.type === 'paragraph') {
                    return <p key={`${section.id}-${index}`}>{block.text}</p>;
                  }

                  if (block.type === 'list') {
                    return (
                      <ul key={`${section.id}-${index}`} className="blog-article-list">
                        {block.items.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    );
                  }

                  if (block.type === 'code') {
                    return (
                      <pre key={`${section.id}-${index}`} className="blog-code-block">
                        <code>{block.code}</code>
                      </pre>
                    );
                  }

                  if (block.type === 'table') {
                    return (
                      <div key={`${section.id}-${index}`} className="blog-table-wrap">
                        <p className="product-meta">{block.caption}</p>
                        <table className="blog-article-table">
                          <thead>
                            <tr>
                              {block.columns.map((column) => <th key={column}>{column}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row) => (
                              <tr key={row.join('-')}>
                                {row.map((cell) => <td key={cell}>{cell}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  const product = productMap.get(block.productSlug);
                  return product ? (
                    <BlogProductCard key={`${section.id}-${index}`} product={product} locale={locale} eyebrow={block.eyebrow} body={block.body} />
                  ) : null;
                })}
              </section>
            ))}

            {relatedProducts.length ? (
              <section className="blog-article-section">
                <div className="section-header trade-card-header">
                  <div>
                    <div className="card-kicker">Related products</div>
                    <h2 className="cart-section-title">Hardware referenced in this article</h2>
                  </div>
                </div>
                <div className="blog-related-product-grid">
                  {relatedProducts.map((product) => (
                    <BlogProductCard key={product.id} product={product} locale={locale} eyebrow="Related product" body={product.shortDescription ?? 'Catalog hardware referenced in the article body.'} />
                  ))}
                </div>
              </section>
            ) : null}

            {author ? (
              <section className="info-card blog-author-card">
                <div className="card-kicker">Author</div>
                <h2 className="cart-section-title">{author.name}</h2>
                <p className="product-meta">{author.role}</p>
                <p className="section-description">{author.bio}</p>
              </section>
            ) : null}

            {relatedPosts.length ? (
              <section className="blog-article-section">
                <div className="section-header trade-card-header">
                  <div>
                    <div className="card-kicker">Related posts</div>
                    <h2 className="cart-section-title">Continue reading</h2>
                  </div>
                </div>
                <div className="blog-card-grid blog-related-post-grid">
                  {relatedPosts.map((relatedPost) => {
                    const relatedAuthor = getBlogAuthorById(catalog, relatedPost.authorId);
                    return (
                      <article key={relatedPost.slug} className="blog-index-card">
                        <a href={withLocalePath(`/blog/${relatedPost.slug}`, locale)} className="blog-card-cover-link">
                          <img src={withLocalePath(`/blog/cover/${relatedPost.slug}`, locale)} alt={relatedPost.coverAlt} className="blog-card-cover" />
                        </a>
                        <div className="blog-card-body">
                          <div className="blog-card-meta-row">
                            <span className="resource-chip">{relatedPost.topic}</span>
                            <span className="product-meta">{relatedPost.readMinutes} min read</span>
                          </div>
                          <h3>
                            <Link href={withLocalePath(`/blog/${relatedPost.slug}`, locale)}>{relatedPost.title}</Link>
                          </h3>
                          <p className="section-description compact-copy">{relatedPost.summary}</p>
                          <div className="blog-card-footer">
                            <div>
                              <strong>{relatedAuthor?.name}</strong>
                              <div className="product-meta">{relatedPost.industry}</div>
                            </div>
                            <Link href={withLocalePath(`/blog/${relatedPost.slug}`, locale)} className="section-link">Read</Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section className="info-card blog-cta-card">
              <div>
                <div className="card-kicker">Next step</div>
                <h2 className="cart-section-title">Subscribe or talk to an engineer</h2>
                <p className="section-description">Use the newsletter flow for future articles, or route the current project into the structured contact path when you need sizing or integration help.</p>
              </div>
              <div className="trade-empty-actions">
                <Link href={withLocalePath('/blog', locale)} className="button-secondary">Subscribe</Link>
                <Link href={withLocalePath('/contact', locale)} className="button-primary">Talk to engineer</Link>
              </div>
            </section>
          </article>

          <aside className="blog-post-toc">
            <article className="info-card blog-toc-card">
              <div className="card-kicker">On this page</div>
              <nav className="blog-toc-list" aria-label="Table of contents">
                {post.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="blog-toc-link">{section.title}</a>
                ))}
              </nav>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}
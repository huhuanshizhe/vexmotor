import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { JsonLdScript } from '@/components/seo/json-ld';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { AddToCompareButton } from '@/components/storefront/add-to-compare-button';
import { AddToWishlistButton } from '@/components/storefront/add-to-wishlist-button';
import { CopyActionButton } from '@/components/storefront/copy-action-button';
import { ProductGallery } from '@/components/storefront/product-gallery';
import { ProductInquiryForm } from '@/components/storefront/product-inquiry-form';
import { RecentlyViewedProducts } from '@/components/storefront/recently-viewed-products';
import { type Locale, withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildVolumePricingTiers } from '@/lib/volume-pricing';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';
import { getCommerceConfig } from '@/server/commerce/config';
import { getHomeData, getProductBySlug, type StorefrontCompatibleGroup, type StorefrontProductCard, type StorefrontProductDetail } from '@/server/storefront';

// Revalidate product pages every 5 minutes (ISR)
export const revalidate = 300;

type DetailSpecRow = {
  label: string;
  value: string;
};

type DetailSpecGroup = {
  title: string;
  description: string;
  rows: DetailSpecRow[];
};

type DetailCompatibleGroup = {
  title: string;
  description: string;
  badge: string;
  items: StorefrontProductCard[];
};

function formatSpecValue(value: string, unit?: string | null) {
  return unit ? `${value} ${unit}` : value;
}

function buildSpecGroups(product: StorefrontProductDetail): DetailSpecGroup[] {
  // Group features by category
  const categoryMap: Record<string, DetailSpecRow[]> = {
    performance: [],
    electrical: [],
    mechanical: [],
    environmental: [],
    general: [],
  };

  product.features.forEach((feature) => {
    const category = feature.category || 'general';
    const row = {
      label: feature.key,
      value: formatSpecValue(feature.value, feature.unit),
    };
    
    if (categoryMap[category]) {
      categoryMap[category].push(row);
    } else {
      categoryMap.general.push(row);
    }
  });

  const attributeRows = product.attributes.map((attribute) => ({
    label: attribute.group,
    value: attribute.value,
  }));
  
  const commercialRows = [
    { label: 'SKU', value: product.sku },
    { label: 'Purchase mode', value: product.purchaseMode === 'buy' ? 'Direct buy' : 'Engineering RFQ' },
    {
      label: 'Stock status',
      value: product.inStock ? `${Math.max(product.stockQuantity, 0)} units ready for standard orders` : 'Lead time confirmed during quote review',
    },
    { label: 'Brand', value: product.brand?.name ?? SITE_NAME },
  ];

  const groups: DetailSpecGroup[] = [];

  // Performance specs first (most important for engineers)
  if (categoryMap.performance.length) {
    groups.push({
      title: 'Performance',
      description: 'Core performance parameters including torque, speed, and precision metrics.',
      rows: categoryMap.performance,
    });
  }

  // Electrical specs
  if (categoryMap.electrical.length) {
    groups.push({
      title: 'Electrical',
      description: 'Voltage, current, and electrical characteristics for driver compatibility.',
      rows: categoryMap.electrical,
    });
  }

  // Mechanical specs
  if (categoryMap.mechanical.length) {
    groups.push({
      title: 'Mechanical',
      description: 'Physical dimensions, mounting, and mechanical interface details.',
      rows: categoryMap.mechanical,
    });
  }

  // Environmental specs
  if (categoryMap.environmental.length) {
    groups.push({
      title: 'Environmental',
      description: 'Operating conditions, protection ratings, and environmental compliance.',
      rows: categoryMap.environmental,
    });
  }

  // General/uncategorized specs
  if (categoryMap.general.length) {
    groups.push({
      title: 'General',
      description: 'Additional specifications and catalog attributes.',
      rows: categoryMap.general,
    });
  }

  if (attributeRows.length) {
    groups.push({
      title: 'Catalog attributes',
      description: 'Structured metadata carried with this SKU from the catalog and content systems.',
      rows: attributeRows,
    });
  }

  groups.push({
    title: 'Commercial & support',
    description: 'Fulfillment and support facts currently available in the storefront contract.',
    rows: commercialRows,
  });

  return groups;
}

const COMPATIBLE_DESCRIPTIONS: Record<string, string> = {
  drivers: 'Control-side matches typically shortlisted next to this SKU.',
  'mechanical-integration': 'Mounting and motion-transfer components frequently paired with the same family.',
  'power-control': 'Power, wiring, and remaining control accessories for system-level planning.',
  custom: 'Compatible accessories and components for system-level planning.',
};

const COMPATIBLE_BADGES: Record<string, string> = {
  drivers: 'Adds compatibility check',
  'mechanical-integration': 'Mechanical fit',
  'power-control': 'System fit',
  custom: 'Compatible',
};

function buildCompatibleGroups(
  explicitGroups: StorefrontCompatibleGroup[],
  fallbackProducts: StorefrontProductCard[],
): DetailCompatibleGroup[] {
  // Use manually configured groups if available
  if (explicitGroups.length > 0) {
    return explicitGroups.map((group) => ({
      title: group.title,
      description: COMPATIBLE_DESCRIPTIONS[group.relationType] ?? COMPATIBLE_DESCRIPTIONS.custom,
      badge: COMPATIBLE_BADGES[group.relationType] ?? COMPATIBLE_BADGES.custom,
      items: group.items.slice(0, 3),
    }));
  }

  // Fallback: regex-based auto-grouping
  const groups: Array<DetailCompatibleGroup & { matcher: RegExp }> = [
    {
      title: 'Drivers',
      description: 'Control-side matches typically shortlisted next to this SKU.',
      badge: 'Adds compatibility check',
      matcher: /(driver|controller)/i,
      items: [],
    },
    {
      title: 'Mechanical integration',
      description: 'Mounting and motion-transfer components frequently paired with the same family.',
      badge: 'Mechanical fit',
      matcher: /(bracket|gear|shaft|linear|coupling)/i,
      items: [],
    },
    {
      title: 'Power & control',
      description: 'Power, wiring, and remaining control accessories for system-level planning.',
      badge: 'System fit',
      matcher: /(power|supply|cable|connector|encoder)/i,
      items: [],
    },
  ];
  const seen = new Set<string>();

  for (const item of fallbackProducts) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    const haystack = `${item.name} ${item.slug}`;
    const targetGroup = groups.find((group) => group.matcher.test(haystack)) ?? groups[groups.length - 1];
    if (targetGroup.items.length < 3) targetGroup.items.push(item);
  }

  return groups.filter((group) => group.items.length).map(({ matcher, ...group }) => group);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getServerSitePreferences();
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: 'Product not found — STEPMOTECH',
      path: '/products',
      locale,
      noIndex: true,
    });
  }

  const topSpecs = product.features.slice(0, 2).map((feature) => `${feature.key} ${formatSpecValue(feature.value, feature.unit)}`);
  const description =
    product.seoDescription ??
    `${product.name} (${product.sku}) with ${topSpecs.join(', ') || 'engineering-grade motion parameters'}, ${product.inStock ? 'multi-warehouse availability' : 'quote-based lead times'}, and ${product.purchaseMode === 'buy' ? `pricing from ${product.price.formatted}` : 'RFQ pricing support'}.`;

  return buildMetadata({
    title: product.seoTitle ?? `${product.name} — ${product.sku} | ${SITE_NAME}`,
    description,
    path: `/products/${slug}`,
    locale,
    type: 'website',
    images: product.coverImage ? [{ url: product.coverImage.url, alt: product.coverImage.alt || product.name }] : undefined,
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ locale }, product, homeData, commerceConfig] = await Promise.all([getServerSitePreferences(), getProductBySlug(slug), getHomeData(), getCommerceConfig()]);

  if (!product) {
    notFound();
  }

  const galleryImages = product.gallery.length ? product.gallery : product.coverImage ? [product.coverImage] : [];
  const category = product.categories[0] ?? null;
  const productsPath = withLocalePath('/products', locale);
  const productPath = withLocalePath(`/products/${product.slug}`, locale);
  const contactPath = withLocalePath('/contact', locale);
  const categoryPath = category ? withLocalePath(`/c/${category.slug}`, locale) : productsPath;
  const productUrl = `${SITE_URL}${productPath}`;
  const documentsHref = `${productPath}#detail-documents`;
  const specGroups = buildSpecGroups(product);
  const topSpecs = specGroups.flatMap((group) => group.rows).slice(0, 5);
  const datasheetAttachment = product.attachments.find((attachment) => /pdf|datasheet|spec/i.test(`${attachment.name} ${attachment.mimeType}`));
  const priceHeadline = product.purchaseMode === 'buy' ? product.price.formatted : 'Request Quote';
  const queryForQuote = new URLSearchParams({ topic: 'quote', product: product.sku }).toString();
  const queryForSample = new URLSearchParams({ topic: 'sample', product: product.sku }).toString();
  const queryForVolumePricing = new URLSearchParams({ sku: product.sku }).toString();
  const queryForCustom = new URLSearchParams({ sourceSku: product.sku, sourceProduct: product.name }).toString();
  const quoteHref = `${contactPath}?${queryForQuote}`;
  const sampleHref = `${contactPath}?${queryForSample}`;
  const volumePricingHref = `${withLocalePath('/volume-pricing', locale)}?${queryForVolumePricing}`;
  const customHref = `${withLocalePath('/custom', locale)}?${queryForCustom}`;
  const bulkPrices =
    product.purchaseMode === 'buy'
      ? buildVolumePricingTiers(product.price.amount, product.price.currency, commerceConfig.volumePricingRules).filter((tier) => tier.minQuantity > 1)
      : [];
  const trustItems = [
    'Warranty 18 months',
    '30-day return support',
    'CE / RoHS documentation support',
    product.attachments.length ? 'CAD / STEP available' : 'CAD / STEP on request',
  ];
  const overviewBullets = [
    `${product.purchaseMode === 'buy' ? 'Direct-buy ready' : 'RFQ-led'} procurement flow for ${product.name}.`,
    topSpecs[0] ? `${topSpecs[0].label}: ${topSpecs[0].value}.` : 'Built for repeatable motion programs.',
    product.attachments.length ? `${product.attachments.length} supporting documents are already attached for engineering review.` : 'Supporting documents can be requested from the engineering team.',
    product.inStock ? 'Standard stock is available for fast dispatch from planned regional warehouses.' : 'Production scheduling and warehouse assignment are confirmed during quotation.',
  ];
  const relatedCandidates = product.relatedProducts.filter((item) => item.id !== product.id);
  const peopleAlsoBought = homeData.mostViewedProducts
    .filter((item) => item.id !== product.id && !relatedCandidates.some((relatedProduct) => relatedProduct.id === item.id))
    .slice(0, 4);
  const compatibleGroups = buildCompatibleGroups(product.compatibleGroups ?? [], [...relatedCandidates, ...peopleAlsoBought]);
  const applicationCards = homeData.featuredIndustries.slice(0, 3).map((industry, index) => {
    const highlightedSpec = topSpecs[index] ?? topSpecs[0];
    const specLine = highlightedSpec ? `${highlightedSpec.label.toLowerCase()} ${highlightedSpec.value}` : 'repeatable motion performance';

    return {
      title: industry.title,
      description: `${industry.description} ${product.name} fits projects that need ${specLine} plus ${product.purchaseMode === 'buy' ? 'catalog fulfillment' : 'engineering RFQ support'}.`,
    };
  });
  const documentCards: Array<{ title: string; meta: string; description: string; href: string; external?: boolean }> = product.attachments.map((attachment) => ({
    title: attachment.name,
    meta: attachment.mimeType.toUpperCase(),
    description: 'Factory-managed file prepared for engineering handoff, sourcing review, or compliance checks.',
    href: attachment.url,
    external: true,
  }));

  if (!documentCards.some((item) => /datasheet/i.test(item.title))) {
    documentCards.push({
      title: 'Datasheet (PDF)',
      meta: 'Request',
      description: 'Ask the engineering team for the latest datasheet export when the file is not yet attached to the SKU.',
      href: quoteHref,
    });
  }

  if (!documentCards.some((item) => /(step|iges|cad|dxf|dwg|3d)/i.test(item.title))) {
    documentCards.push({
      title: '3D / CAD package',
      meta: 'STEP / IGES',
      description: 'Request a CAD package for system integration, mounting checks, and enclosure validation.',
      href: quoteHref,
    });
  }

  if (!documentCards.some((item) => /(manual|wiring|report|certificate|cert)/i.test(item.title))) {
    documentCards.push({
      title: 'Wiring / certification pack',
      meta: 'Support',
      description: 'Manuals, wiring notes, and certificates can be bundled through the pre-sales support workflow.',
      href: quoteHref,
    });
  }

  const faqItems = [
    {
      question: `How do I validate ${product.name} quickly?`,
      answer: topSpecs.length
        ? `Start with ${topSpecs.slice(0, 3).map((item) => `${item.label} ${item.value}`).join(', ')} and confirm the purchase mode before finalizing the bill of materials.`
        : `Start with the SKU, purchase mode, and attached documents, then confirm the remaining mechanical and electrical details with the engineering team.`,
    },
    {
      question: `Can I order ${product.sku} directly online?`,
      answer: product.purchaseMode === 'buy' ? 'Yes. This SKU is configured for direct checkout, quantity changes, and tier-price review from the PDP.' : 'This SKU currently follows an RFQ workflow so the engineering team can confirm spec, lead time, and commercial terms.',
    },
    {
      question: 'What documents are available for this product?',
      answer: product.attachments.length
        ? `${product.attachments.length} document${product.attachments.length === 1 ? '' : 's'} are attached now, and additional CAD or compliance files can be requested from support.`
        : 'Datasheets, CAD, manuals, and compliance files can be requested through the quote and contact workflow when they are not attached directly to the SKU.',
    },
    {
      question: 'How is stock fulfilled across warehouses?',
      answer: product.inStock ? 'Standard orders are planned against current stock coverage and routed to the nearest viable warehouse program.' : 'When stock is not available, the team confirms production scheduling, warehouse assignment, and ETA during the RFQ review.',
    },
  ];
  const detailSections = [
    { id: 'detail-overview', label: 'Overview' },
    { id: 'detail-specifications', label: 'Specs' },
    { id: 'detail-documents', label: 'CAD & Docs' },
    { id: 'detail-compatible', label: 'Compatible' },
    { id: 'detail-applications', label: 'Applications' },
    { id: 'detail-faq', label: 'FAQ' },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: 'Home', path: '/' },
      { name: 'Products', path: '/products' },
      ...(category ? [{ name: category.name, path: `/c/${category.slug}` }] : []),
      { name: product.name, path: `/products/${product.slug}` },
    ],
    locale,
  );
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    url: productUrl,
    description: product.seoDescription ?? product.shortDescription ?? product.description,
    image: galleryImages.map((image) => image.url),
    brand: {
      '@type': 'Brand',
      name: product.brand?.name ?? SITE_NAME,
    },
    category: product.categories.map((item) => item.name).join(', '),
    // Note: aggregateRating not yet available in schema
    // aggregateRating: product.ratingValue
    //   ? {
    //       '@type': 'AggregateRating',
    //       ratingValue: product.ratingValue,
    //       reviewCount: product.ratingCount ?? 0,
    //       bestRating: 5,
    //       worstRating: 1,
    //     }
    //   : undefined,
    additionalProperty: specGroups.flatMap((group) => group.rows).slice(0, 24).map((row) => ({
      '@type': 'PropertyValue',
      name: row.label,
      value: row.value,
    })),
    offers:
      product.purchaseMode === 'buy'
        ? {
            '@type': 'Offer',
            url: productUrl,
            seller: { '@type': 'Organization', name: SITE_NAME },
            priceCurrency: product.price.currency,
            price: product.price.amount.toFixed(2),
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
            priceSpecification: bulkPrices.map((item) => ({
              '@type': 'UnitPriceSpecification',
              priceCurrency: product.price.currency,
              price: item.unitPriceAmount.toFixed(2),
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: item.minQuantity,
                unitCode: 'C62',
              },
            })),
          }
        : undefined,
  };
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <StorefrontFrame>
      <JsonLdScript id="product-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLdScript id="product-jsonld" data={productJsonLd} />
      <JsonLdScript id="product-faq-jsonld" data={faqJsonLd} />

      <section className="section product-detail-section">
        <div className="section-inner">
          <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
            <Link href={withLocalePath('/', locale)}>Home</Link>
            <span>/</span>
            <Link href={productsPath}>Products</Link>
            {category ? (
              <>
                <span>/</span>
                <Link href={categoryPath}>{category.name}</Link>
              </>
            ) : null}
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="product-detail-grid">
            <div className="product-gallery-column">
              <ProductGallery images={galleryImages} productName={product.name} />

              <div className="detail-share-row pdp-share-row">
                <span className="summary-label">Share & docs</span>
                <div className="detail-share-chips">
                  <CopyActionButton value={productUrl} idleLabel="Copy link" copiedLabel="Link copied" toastTitle="Product link copied" className="button-secondary" />
                  {datasheetAttachment ? (
                    <a href={datasheetAttachment.url} target="_blank" rel="noreferrer" className="button-secondary">
                      Datasheet
                    </a>
                  ) : null}
                  <Link href={quoteHref} className="button-secondary">
                    Engineering support
                  </Link>
                </div>
              </div>
            </div>

            <article className="info-card product-summary-card pdp-buybox-card">
              <div className="pdp-category-trail">
                <Link href={productsPath}>Products</Link>
                {product.categories.slice(0, 2).map((item) => (
                  <Link key={item.id} href={withLocalePath(`/c/${item.slug}`, locale)}>
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="product-card-top">
                <span className="product-badge">{product.purchaseMode === 'buy' ? 'Direct Buy' : 'RFQ Project'}</span>
                <span className="product-status">{product.purchaseMode === 'buy' ? (product.inStock ? 'Warehouse stock available' : 'Production scheduling') : 'Engineering review workflow'}</span>
              </div>

              <div className="card-kicker">{category ? `${category.name} product detail` : 'Industrial motion catalog'}</div>
              <h1 className="section-title">{product.name}</h1>

              <div className="pdp-sku-row">
                <p className="product-meta">SKU {product.sku}</p>
                <div className="pdp-sku-actions">
                  <CopyActionButton value={product.sku} idleLabel="Copy SKU" copiedLabel="SKU copied" toastTitle="SKU copied" className="button-secondary" />
                  {datasheetAttachment ? (
                    <a href={datasheetAttachment.url} target="_blank" rel="noreferrer" className="button-secondary">
                      View datasheet
                    </a>
                  ) : null}
                </div>
              </div>

              <p className="section-description">{product.shortDescription ?? product.description}</p>

              <div className="pdp-mini-spec-grid">
                {topSpecs.map((item) => (
                  <article key={`${item.label}-${item.value}`} className="pdp-mini-spec-card">
                    <span className="summary-label">{item.label}</span>
                    <strong>{item.value}</strong>
                  </article>
                ))}
              </div>

              <div className="pdp-stock-card">
                <article className="summary-stat">
                  <span className="summary-label">Availability</span>
                  <strong>{product.inStock ? `${Math.max(product.stockQuantity, 0)} units ready` : 'Quote-based allocation'}</strong>
                </article>
                <article className="summary-stat">
                  <span className="summary-label">Warehouse</span>
                  <strong>{product.inStock ? 'CN / US / EU planning' : 'Assigned during review'}</strong>
                </article>
                <article className="summary-stat">
                  <span className="summary-label">ETA</span>
                  <strong>{product.inStock ? 'Ships today to 5 business days' : '3 to 15 business days'}</strong>
                </article>
              </div>

              <div className="product-pricing-stack">
                <p className="product-price">{priceHeadline}</p>
                {product.compareAtPrice ? <p className="comparison-note">Reference price {product.compareAtPrice.formatted}</p> : null}
                {bulkPrices.length ? (
                  <>
                    <details className="pdp-tier-pricing">
                    <summary>Tier pricing</summary>
                    <div className="detail-volume-pricing">
                      {bulkPrices.map((item) => (
                        <span key={item.label} className="detail-volume-line">
                          {item.rangeLabel} pcs {item.unitPriceLabel}
                        </span>
                      ))}
                    </div>
                    </details>
                    <Link href={volumePricingHref} className="detail-inline-link">
                      View volume pricing
                    </Link>
                  </>
                ) : (
                  <p className="section-description compact-copy">Pricing is finalized through the quote workflow once engineering scope and volume are confirmed.</p>
                )}
              </div>

              <div className="product-action-stack">
                {product.purchaseMode === 'buy' ? (
                  <AddToCartButton productId={product.id} showQuantitySelector showBuyNow />
                ) : (
                  <div className="inquiry-form-wrap">
                    <ProductInquiryForm productId={product.id} productName={product.name} />
                  </div>
                )}

                <div className="pdp-secondary-actions">
                  {product.purchaseMode === 'buy' ? (
                    <Link href={sampleHref} className="button-secondary">
                      Request Sample
                    </Link>
                  ) : null}
                  <Link href={customHref} className="button-secondary">
                    Need a custom variant?
                  </Link>
                  <Link href={quoteHref} className="button-secondary">
                    {product.purchaseMode === 'buy' ? 'Add to Quote' : 'Request Quote'}
                  </Link>
                  <AddToCompareButton
                    item={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      sku: product.sku,
                      priceLabel: product.purchaseMode === 'buy' ? product.price.formatted : 'Request Quote',
                      purchaseMode: product.purchaseMode,
                      inStock: product.inStock,
                      shortDescription: product.shortDescription,
                      categories: product.categories.map((item) => item.name),
                    }}
                  />
                  <AddToWishlistButton productId={product.id} />
                </div>
              </div>

              <div className="pdp-trust-list">
                {trustItems.map((item) => (
                  <div key={item} className="pdp-trust-item">
                    {item}
                  </div>
                ))}
              </div>

              <article className="summary-stat">
                <span className="summary-label">Custom program</span>
                <strong>Need changes to shaft, winding, gearbox, or environment?</strong>
                <Link href={customHref} className="section-link">
                  Start custom development with this SKU
                </Link>
              </article>
            </article>
          </div>
        </div>
      </section>

      <section className="section detail-tabs-section">
        <div className="section-inner">
          <nav className="detail-tab-nav detail-subnav" aria-label="Product details navigation">
            {detailSections.map((tab) => (
              <a key={tab.id} href={`#${tab.id}`} className="detail-tab-link">
                {tab.label}
              </a>
            ))}
          </nav>

          <article id="detail-overview" className="info-card detail-anchor-card">
            <div className="section-header detail-section-header">
              <div>
                <h2 className="section-title">Overview</h2>
                <p className="section-description">A decision-ready summary of the family, purchase posture, and technical fit before deeper spec review.</p>
              </div>
            </div>

            <div className="pdp-overview-grid">
              <div className="detail-inline-meta">
                {/* Use descriptionLong if available, fallback to description */}
                <div className="product-long-description">
                  <p className="section-description" style={{ whiteSpace: 'pre-line' }}>
                    {product.descriptionLong || product.description}
                  </p>
                </div>
                {product.brand ? (
                  <div className="detail-inline-meta">
                    <span className="card-kicker">Brand</span>
                    <strong>{product.brand.name}</strong>
                  </div>
                ) : null}
                {product.categories.length ? (
                  <div className="detail-inline-meta">
                    <span className="card-kicker">Product family</span>
                    <div className="detail-tag-list">
                      {product.categories.map((item) => (
                        <Link key={item.id} href={withLocalePath(`/c/${item.slug}`, locale)} className="filter-chip">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="pdp-overview-bullets">
                {overviewBullets.map((item) => (
                  <article key={item} className="summary-stat">
                    <span className="summary-label">Snapshot</span>
                    <strong>{item}</strong>
                  </article>
                ))}
              </div>
            </div>
          </article>

          <article id="detail-specifications" className="info-card detail-anchor-card">
            <div className="section-header detail-section-header">
              <div>
                <h2 className="section-title">Specifications</h2>
                <p className="section-description">Grouped specs, catalog attributes, and commercial support details for engineering handoff and SEO parity.</p>
              </div>

              <div className="pdp-section-actions">
                {datasheetAttachment ? (
                  <a href={datasheetAttachment.url} target="_blank" rel="noreferrer" className="button-secondary">
                    Download all specs (PDF)
                  </a>
                ) : (
                  <Link href={quoteHref} className="button-secondary">
                    Request specs
                  </Link>
                )}
                <CopyActionButton
                  value={JSON.stringify(specGroups, null, 2)}
                  idleLabel="Copy as JSON"
                  copiedLabel="JSON copied"
                  toastTitle="Specification JSON copied"
                  className="button-secondary"
                />
                <Link href={documentsHref} className="button-secondary">
                  View matching docs
                </Link>
              </div>
            </div>

            <p className="section-description compact-copy">Use the global unit selector in the header to keep comparisons aligned across category pages and the PDP.</p>

            <div className="pdp-spec-group-list">
              {specGroups.map((group) => (
                <section key={group.title} className="pdp-spec-group">
                  <div className="pdp-spec-group-header">
                    <h3>{group.title}</h3>
                    <p className="section-description compact-copy">{group.description}</p>
                  </div>

                  <div className="spec-table">
                    {group.rows.map((row) => (
                      <div key={`${group.title}-${row.label}-${row.value}`} className="spec-row">
                        <span className="spec-label">{row.label}</span>
                        <strong className="spec-value">{row.value}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>

          <article id="detail-documents" className="info-card detail-anchor-card">
            <div className="section-header detail-section-header">
              <div>
                <h2 className="section-title">CAD & Documents</h2>
                <p className="section-description">Datasheets, CAD, manuals, wiring notes, and certification support surfaced with the same quick-scan posture as the design reference.</p>
              </div>
            </div>

            <div className="pdp-doc-grid">
              {documentCards.slice(0, 6).map((item) => (
                <article key={`${item.title}-${item.meta}`} className="pdp-doc-card">
                  <span className="pdp-doc-card-meta">{item.meta}</span>
                  <strong>{item.title}</strong>
                  <p className="section-description compact-copy">{item.description}</p>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer">
                      Open file
                    </a>
                  ) : (
                    <Link href={item.href}>Request file</Link>
                  )}
                </article>
              ))}
            </div>
          </article>

          <article id="detail-compatible" className="info-card detail-anchor-card">
            <div className="section-header detail-section-header">
              <div>
                <h2 className="section-title">Compatible Products</h2>
                <p className="section-description">Carefully selected accessories, drivers, and integration components that work seamlessly with this product.</p>
              </div>
            </div>
          
            {compatibleGroups.length ? (
              <div className="compatible-groups-container">
                {compatibleGroups.map((group) => (
                  <div key={group.title} className="compatible-group">
                    <div className="compatible-group-header">
                      <span className="compatible-badge">{group.badge}</span>
                      <h3 className="compatible-group-title">{group.title}</h3>
                      <p className="compatible-group-description">{group.description}</p>
                    </div>
                    <div className="compatible-product-list">
                      {group.items.map((item) => (
                        <Link
                          key={item.id}
                          href={withLocalePath(`/products/${item.slug}`, locale)}
                          className="compatible-product-card"
                        >
                          <div className="compatible-product-image">
                            {item.coverImage ? (
                              <img
                                src={item.coverImage.url}
                                alt={item.coverImage.alt || item.name}
                                loading="lazy"
                              />
                            ) : (
                              <div className="compatible-product-placeholder">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="3" y="3" width="18" height="18" rx="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <path d="M21 15l-5-5L5 21" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="compatible-product-info">
                            <h4 className="compatible-product-name">{item.name}</h4>
                            {item.shortDescription && (
                              <p className="compatible-product-desc">{item.shortDescription}</p>
                            )}
                            <div className="compatible-product-footer">
                              <span className="compatible-product-price">
                                {item.purchaseMode === 'buy' ? item.price.formatted : 'Request Quote'}
                              </span>
                              <span className="compatible-product-mode">
                                {item.purchaseMode === 'buy' ? 'Direct Buy' : 'RFQ'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="section-description">Compatible accessories and controls will appear here as more catalog relationships are configured.</p>
            )}
          </article>

          <article id="detail-applications" className="info-card detail-anchor-card">
            <div className="section-header detail-section-header">
              <div>
                <h2 className="section-title">Used in applications</h2>
                <p className="section-description">Application guidance reusing the industry framing already available in the storefront seed data.</p>
              </div>
            </div>

            <div className="pdp-application-grid">
              {applicationCards.map((item) => (
                <article key={item.title} className="pdp-application-card">
                  <span className="card-kicker">Application fit</span>
                  <h3>{item.title}</h3>
                  <p className="section-description compact-copy">{item.description}</p>
                  <Link href={quoteHref}>Discuss this use case</Link>
                </article>
              ))}
            </div>
          </article>

          <article id="detail-faq" className="info-card detail-anchor-card">
            <div className="section-header detail-section-header">
              <div>
                <h2 className="section-title">FAQ for this product</h2>
                <p className="section-description">Product-specific FAQ content is exposed directly on the PDP and mirrored into FAQPage structured data.</p>
              </div>
            </div>

            <div className="pdp-faq-list">
              {faqItems.map((item) => (
                <details key={item.question} className="category-faq-item pdp-faq-item">
                  <summary>{item.question}</summary>
                  <p className="section-description compact-copy">{item.answer}</p>
                </details>
              ))}
            </div>
          </article>

          <RecentlyViewedProducts currentProduct={product} fallbackProducts={[...relatedCandidates, ...peopleAlsoBought]} locale={locale} />
        </div>
      </section>
    </StorefrontFrame>
  );
}

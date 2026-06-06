'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProductDetailTabKey =
  | 'description'
  | 'specifications'
  | 'dimensions'
  | 'torque-curves'
  | 'custom-design'
  | 'downloads'
  | 'reviews';

type ProductDetailSpecGroup = {
  title: string;
  description: string;
  rows: Array<{
    label: string;
    value: string;
  }>;
};

type ProductDetailImage = {
  url: string;
  alt?: string | null;
  imageType?: string | null;
  isDimension?: boolean;
};

type ProductDocumentCard = {
  title: string;
  meta: string;
  description: string;
  href: string;
  external?: boolean;
};

type ProductDetailTabsProps = {
  description: string;
  specGroups: ProductDetailSpecGroup[];
  dimensionImages: ProductDetailImage[];
  torqueCurveImages: ProductDetailImage[];
  dimensionDocumentHref?: string;
  torqueCurveDocumentHref?: string;
  datasheetUrl?: string;
  quoteHref: string;
  customHref: string;
  contactPath: string;
  documentCards: ProductDocumentCard[];
};

const TAB_DEFINITIONS: Array<{
  key: ProductDetailTabKey;
  label: string;
  panelId: string;
  legacyHash: string;
}> = [
  { key: 'description', label: 'Description', panelId: 'detail-overview', legacyHash: 'tab-description' },
  { key: 'specifications', label: 'Specifications', panelId: 'detail-specifications', legacyHash: 'tab-specifications' },
  { key: 'dimensions', label: 'Dimensions', panelId: 'detail-dimensions', legacyHash: 'tab-dimensions' },
  { key: 'torque-curves', label: 'Torque Curves', panelId: 'detail-torque-curves', legacyHash: 'tab-torque-curves' },
  { key: 'custom-design', label: 'CUSTOM DESIGN', panelId: 'detail-custom-design', legacyHash: 'tab-custom-design' },
  { key: 'downloads', label: 'Downloads', panelId: 'detail-downloads', legacyHash: 'tab-downloads' },
  { key: 'reviews', label: 'Reviews', panelId: 'detail-reviews', legacyHash: 'tab-reviews' },
];

const HASH_TO_TAB = TAB_DEFINITIONS.reduce<Record<string, ProductDetailTabKey>>((hashToTab, tab) => {
  hashToTab[tab.panelId] = tab.key;
  hashToTab[tab.legacyHash] = tab.key;
  return hashToTab;
}, {});

const TAB_BY_KEY = TAB_DEFINITIONS.reduce<Record<ProductDetailTabKey, (typeof TAB_DEFINITIONS)[number]>>((tabsByKey, tab) => {
  tabsByKey[tab.key] = tab;
  return tabsByKey;
}, {} as Record<ProductDetailTabKey, (typeof TAB_DEFINITIONS)[number]>);

export function ProductDetailTabs({
  description,
  specGroups,
  dimensionImages,
  torqueCurveImages,
  dimensionDocumentHref,
  torqueCurveDocumentHref,
  datasheetUrl,
  quoteHref,
  customHref,
  contactPath,
  documentCards,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductDetailTabKey>('description');

  useEffect(() => {
    const syncTabFromHash = () => {
      const rawHash = window.location.hash.replace(/^#/, '');
      const nextTab = HASH_TO_TAB[rawHash];

      if (!nextTab) {
        return;
      }

      setActiveTab(nextTab);

      const canonicalHash = TAB_BY_KEY[nextTab].panelId;
      if (rawHash !== canonicalHash) {
        window.history.replaceState(window.history.state, '', `#${canonicalHash}`);
      }
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);

    return () => {
      window.removeEventListener('hashchange', syncTabFromHash);
    };
  }, []);

  const handleTabChange = (tabKey: ProductDetailTabKey) => {
    setActiveTab(tabKey);
    const nextHash = TAB_BY_KEY[tabKey].panelId;

    if (window.location.hash !== `#${nextHash}`) {
      window.history.replaceState(window.history.state, '', `#${nextHash}`);
    }
  };

  return (
    <>
      <nav className="detail-tab-nav" aria-label="Product details navigation" role="tablist">
        {TAB_DEFINITIONS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              id={`${tab.panelId}-tab`}
              type="button"
              className={isActive ? 'tab-button active' : 'tab-button'}
              role="tab"
              aria-selected={isActive}
              aria-controls={tab.panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="tab-content-wrapper">
        <div
          id="detail-overview"
          className={activeTab === 'description' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-overview-tab"
          hidden={activeTab !== 'description'}
        >
          <div className="info-card">
            <div className="product-description-content">
              <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
            </div>
          </div>
        </div>

        <div
          id="detail-specifications"
          className={activeTab === 'specifications' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-specifications-tab"
          hidden={activeTab !== 'specifications'}
        >
          <article className="info-card">
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
        </div>

        <div
          id="detail-dimensions"
          className={activeTab === 'dimensions' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-dimensions-tab"
          hidden={activeTab !== 'dimensions'}
        >
          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Dimensional Drawings</h2>
              <p className="section-description">Technical drawings with precise measurements for integration planning.</p>
            </div>
            <div className="dimensions-gallery">
              {dimensionImages.length ? (
                dimensionImages.map((image, index) => (
                  <figure key={`${image.url}-${index}`} className="detail-media-card">
                    <img src={image.url} alt={image.alt || 'Dimension drawing'} className="detail-media-image" loading="lazy" />
                  </figure>
                ))
              ) : dimensionDocumentHref ? (
                <div className="dimension-placeholder">
                  <p>Legacy dimension drawings are available in the original technical file package.</p>
                  <a href={dimensionDocumentHref} target="_blank" rel="noreferrer" className="button-secondary">
                    Open dimension reference
                  </a>
                </div>
              ) : (
                <div className="dimension-placeholder">
                  <p>Dimensional drawings will be available upon request.</p>
                  <Link href={quoteHref} className="button-secondary">
                    Request dimension drawings
                  </Link>
                </div>
              )}
            </div>
          </article>
        </div>

        <div
          id="detail-torque-curves"
          className={activeTab === 'torque-curves' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-torque-curves-tab"
          hidden={activeTab !== 'torque-curves'}
        >
          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Torque-Speed Curves</h2>
              <p className="section-description">Performance characteristics showing torque output across operating speeds.</p>
            </div>
            <div className="torque-curves-gallery">
              {torqueCurveImages.length ? (
                torqueCurveImages.map((image, index) => (
                  <figure key={`${image.url}-${index}`} className="detail-media-card">
                    <img src={image.url} alt={image.alt || 'Torque-speed curve'} className="detail-media-image" loading="lazy" />
                  </figure>
                ))
              ) : torqueCurveDocumentHref || datasheetUrl ? (
                <div className="torque-curve-content">
                  <p>Complete torque-speed curves are available in the product datasheet.</p>
                  <a href={torqueCurveDocumentHref || datasheetUrl} target="_blank" rel="noreferrer" className="button-secondary">
                    Download Datasheet with Curves
                  </a>
                </div>
              ) : (
                <div className="torque-curve-placeholder">
                  <p>Torque-speed curves will be available upon request.</p>
                  <Link href={quoteHref} className="button-secondary">
                    Request torque curves
                  </Link>
                </div>
              )}
            </div>
          </article>
        </div>

        <div
          id="detail-custom-design"
          className={activeTab === 'custom-design' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-custom-design-tab"
          hidden={activeTab !== 'custom-design'}
        >
          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Custom Design Services</h2>
              <p className="section-description">Tailored solutions to meet your specific application requirements.</p>
            </div>
            <div className="custom-design-content">
              <p>Need changes to shaft, winding, gearbox, or environment? Our engineering team can customize this product to your exact specifications.</p>
              <div className="custom-options">
                <div className="custom-option">
                  <strong>Shaft Modifications</strong>
                  <p>Custom length, diameter, keyway, D-cut, or special profiles</p>
                </div>
                <div className="custom-option">
                  <strong>Winding Options</strong>
                  <p>Voltage, current, and resistance adjustments for optimal performance</p>
                </div>
                <div className="custom-option">
                  <strong>Gearbox Integration</strong>
                  <p>Ratio selection and mounting configuration</p>
                </div>
                <div className="custom-option">
                  <strong>Environmental Protection</strong>
                  <p>IP rating upgrades, special coatings, extreme temperature operation</p>
                </div>
              </div>
              <Link href={customHref} className="button-secondary" style={{ marginTop: '24px' }}>
                Start Custom Development
              </Link>
            </div>
          </article>
        </div>

        <div
          id="detail-downloads"
          className={activeTab === 'downloads' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-downloads-tab"
          hidden={activeTab !== 'downloads'}
        >
          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Downloads & Documentation</h2>
              <p className="section-description">Technical documents, datasheets, and CAD files for engineering review.</p>
            </div>
            <div className="pdp-doc-grid">
              {documentCards.map((item) => (
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
        </div>

        <div
          id="detail-reviews"
          className={activeTab === 'reviews' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-reviews-tab"
          hidden={activeTab !== 'reviews'}
        >
          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Customer Reviews</h2>
              <p className="section-description">See what other engineers and buyers are saying about this product.</p>
            </div>
            <div className="reviews-placeholder">
              <p>Reviews will be available soon. Be the first to share your experience!</p>
              <Link href={contactPath} className="button-secondary">
                Contact us with feedback
              </Link>
            </div>
          </article>
        </div>

      </div>
    </>
  );
}
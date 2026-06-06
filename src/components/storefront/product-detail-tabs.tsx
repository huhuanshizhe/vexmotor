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

function formatStatValue(value: number) {
  return String(value).padStart(2, '0');
}

const TAB_DEFINITIONS: Array<{
  key: ProductDetailTabKey;
  label: string;
  panelId: string;
  legacyHash: string;
}> = [
  { key: 'description', label: 'Overview', panelId: 'detail-overview', legacyHash: 'tab-description' },
  { key: 'specifications', label: 'Specifications', panelId: 'detail-specifications', legacyHash: 'tab-specifications' },
  { key: 'dimensions', label: 'Dimensions', panelId: 'detail-dimensions', legacyHash: 'tab-dimensions' },
  { key: 'torque-curves', label: 'Torque Curves', panelId: 'detail-torque-curves', legacyHash: 'tab-torque-curves' },
  { key: 'custom-design', label: 'Custom Program', panelId: 'detail-custom-design', legacyHash: 'tab-custom-design' },
  { key: 'downloads', label: 'Documents', panelId: 'detail-downloads', legacyHash: 'tab-downloads' },
  { key: 'reviews', label: 'Field Feedback', panelId: 'detail-reviews', legacyHash: 'tab-reviews' },
];

const TAB_BY_KEY = TAB_DEFINITIONS.reduce<Record<ProductDetailTabKey, (typeof TAB_DEFINITIONS)[number]>>((accumulator, tab) => {
  accumulator[tab.key] = tab;
  return accumulator;
}, {} as Record<ProductDetailTabKey, (typeof TAB_DEFINITIONS)[number]>);

const HASH_TO_TAB = TAB_DEFINITIONS.reduce<Record<string, ProductDetailTabKey>>((accumulator, tab) => {
  accumulator[tab.panelId] = tab.key;
  accumulator[tab.legacyHash] = tab.key;
  return accumulator;
}, {});

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
  const specRowCount = specGroups.reduce((total, group) => total + group.rows.length, 0);
  const externalDocumentCount = documentCards.filter((item) => item.external).length;
  const requestDocumentCount = Math.max(documentCards.length - externalDocumentCount, 0);
  const overviewParagraphs = description
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const normalizedOverviewParagraphs = overviewParagraphs.length ? overviewParagraphs : [description.trim()].filter(Boolean);
  const dossierStats = [
    {
      label: 'Spec groups',
      value: formatStatValue(specGroups.length),
      note: 'Electrical, mechanical and commercial coverage',
    },
    {
      label: 'Data rows',
      value: formatStatValue(specRowCount),
      note: 'Normalized points for engineering and sourcing review',
    },
    {
      label: 'Live files',
      value: formatStatValue(externalDocumentCount),
      note: 'Attached PDFs and reference files available now',
    },
    {
      label: 'Visual refs',
      value: formatStatValue(dimensionImages.length + torqueCurveImages.length),
      note: 'Drawings and curve visuals surfaced in-page',
    },
  ];

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
      <div className="detail-dossier-header">
        <div className="detail-dossier-copy">
          <span className="card-kicker">Engineering dossier</span>
          <h2 className="detail-dossier-title">Technical review, drawings and procurement files in one structured flow.</h2>
          <p className="section-description">Start with the engineering brief, validate fit in the dossier, then move into drawings, curves and file handoff without hunting through cluttered panels.</p>
        </div>

        <div className="detail-dossier-metrics">
          {dossierStats.map((item) => (
            <article key={item.label} className="detail-dossier-metric">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </div>

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
          <div className="detail-overview-layout">
            <article className="info-card detail-panel-card">
              <div className="detail-panel-heading">
                <div className="detail-panel-copy">
                  <span className="card-kicker">Engineering brief</span>
                  <h3 className="detail-panel-title">Overview of fit, motion behavior and sourcing context.</h3>
                </div>
                <div className="detail-panel-badges">
                  <span className="detail-panel-badge">{specGroups.length} spec groups</span>
                  <span className="detail-panel-badge">{externalDocumentCount} live files</span>
                </div>
              </div>

              <div className="product-description-content detail-copy-stack">
                {normalizedOverviewParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 32)}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </article>

            <aside className="info-card detail-rail-card">
              <div className="detail-rail-section">
                <span className="card-kicker">Review priorities</span>
                <ul className="detail-rail-list">
                  {specGroups.slice(0, 4).map((group) => (
                    <li key={group.title}>
                      <strong>{group.title}</strong>
                      <span>{group.rows.length} data lines</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-rail-section">
                <span className="card-kicker">Next step</span>
                <p className="section-description compact-copy">Use drawings and torque curves to confirm mechanical fit before sending the SKU into procurement or a custom review.</p>
                <div className="detail-rail-actions">
                  <Link href={quoteHref} className="button-secondary">
                    Request technical review
                  </Link>
                  <Link href={customHref} className="detail-inline-link">
                    Open custom program
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div
          id="detail-specifications"
          className={activeTab === 'specifications' ? 'product-tab-content active' : 'product-tab-content'}
          role="tabpanel"
          aria-labelledby="detail-specifications-tab"
          hidden={activeTab !== 'specifications'}
        >
          <article className="info-card detail-panel-card">
            <div className="detail-panel-heading">
              <div className="detail-panel-copy">
                <span className="card-kicker">Specification dossier</span>
                <h3 className="detail-panel-title">Structured electrical, mechanical and commercial values.</h3>
              </div>
              <div className="detail-panel-badges">
                <span className="detail-panel-badge">{specGroups.length} groups</span>
                <span className="detail-panel-badge">{specRowCount} rows</span>
              </div>
            </div>

            <div className="detail-summary-strip">
              {dossierStats.slice(0, 3).map((item) => (
                <article key={item.label} className="detail-summary-tile">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>

            <div className="pdp-spec-group-list">
              {specGroups.map((group) => (
                <section key={group.title} className="pdp-spec-group detail-group-card">
                  <div className="pdp-spec-group-header detail-group-header">
                    <div>
                      <h3>{group.title}</h3>
                      <p className="section-description compact-copy">{group.description}</p>
                    </div>
                    <span className="detail-panel-badge">{group.rows.length} rows</span>
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
          <article className="info-card detail-panel-card">
            <div className="detail-panel-heading">
              <div className="detail-panel-copy">
                <span className="card-kicker">Mechanical verification</span>
                <h2 className="detail-panel-title">Dimensional drawings for integration, mounting and enclosure checks.</h2>
              </div>
              <div className="detail-panel-badges">
                <span className="detail-panel-badge">{dimensionImages.length || (dimensionDocumentHref ? 1 : 0)} reference source</span>
                {dimensionDocumentHref ? (
                  <a href={dimensionDocumentHref} target="_blank" rel="noreferrer" className="detail-tab-link">
                    Source PDF
                  </a>
                ) : null}
              </div>
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
          <article className="info-card detail-panel-card">
            <div className="detail-panel-heading">
              <div className="detail-panel-copy">
                <span className="card-kicker">Performance validation</span>
                <h2 className="detail-panel-title">Torque-speed curves for driver sizing and operating-speed review.</h2>
              </div>
              <div className="detail-panel-badges">
                <span className="detail-panel-badge">{torqueCurveImages.length || (torqueCurveDocumentHref || datasheetUrl ? 1 : 0)} curve source</span>
                {torqueCurveDocumentHref || datasheetUrl ? (
                  <a href={torqueCurveDocumentHref || datasheetUrl} target="_blank" rel="noreferrer" className="detail-tab-link">
                    Curve PDF
                  </a>
                ) : null}
              </div>
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
                    Download datasheet with curves
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
          <article className="info-card detail-panel-card">
            <div className="detail-panel-heading">
              <div className="detail-panel-copy">
                <span className="card-kicker">Custom engineering</span>
                <h2 className="detail-panel-title">Modification paths for shaft, winding, drivetrain and environment.</h2>
              </div>
              <div className="detail-panel-badges">
                <span className="detail-panel-badge">4 program modules</span>
                <span className="detail-panel-badge">Pilot-to-batch ready</span>
              </div>
            </div>

            <div className="custom-design-content">
              <p className="section-description">Use the same base frame and tailor the motor around your mechanics, electrical target, motion profile or environmental constraints.</p>

              <div className="custom-program-grid">
                <article className="custom-program-card">
                  <strong>Shaft modifications</strong>
                  <p>Custom length, diameter, keyway, D-cut or special profiles.</p>
                </article>
                <article className="custom-program-card">
                  <strong>Winding options</strong>
                  <p>Voltage, current and resistance adjustments for the required driver window.</p>
                </article>
                <article className="custom-program-card">
                  <strong>Gearbox integration</strong>
                  <p>Ratio selection, backlash targets and mounting configuration around the same motor family.</p>
                </article>
                <article className="custom-program-card">
                  <strong>Environmental protection</strong>
                  <p>IP upgrades, coatings and temperature-range adjustments for harsher duty cycles.</p>
                </article>
              </div>

              <div className="custom-program-steps">
                <article className="custom-program-step">
                  <span className="card-kicker">Step 01</span>
                  <strong>Application brief</strong>
                  <p>Share motion target, driver stack, mounting limits and environmental conditions.</p>
                </article>
                <article className="custom-program-step">
                  <span className="card-kicker">Step 02</span>
                  <strong>Engineering review</strong>
                  <p>We confirm winding, shaft, gearbox and thermal tradeoffs against the base SKU.</p>
                </article>
                <article className="custom-program-step">
                  <span className="card-kicker">Step 03</span>
                  <strong>Pilot approval</strong>
                  <p>Prototype, sample sign-off and batch handoff follow the same documented path.</p>
                </article>
              </div>

              <div className="custom-program-actions">
                <Link href={customHref} className="button-primary">
                  Start custom development
                </Link>
                <Link href={contactPath} className="button-secondary">
                  Talk to an engineer
                </Link>
              </div>
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
          <article className="info-card detail-panel-card">
            <div className="detail-panel-heading">
              <div className="detail-panel-copy">
                <span className="card-kicker">Documentation pack</span>
                <h2 className="detail-panel-title">Datasheets, support files and request-based engineering documents.</h2>
              </div>
              <div className="detail-panel-badges">
                <span className="detail-panel-badge">{externalDocumentCount} live downloads</span>
                <span className="detail-panel-badge">{requestDocumentCount} request workflows</span>
              </div>
            </div>

            <div className="detail-summary-strip">
              <article className="detail-summary-tile">
                <strong>{formatStatValue(externalDocumentCount)}</strong>
                <span>Open now</span>
              </article>
              <article className="detail-summary-tile">
                <strong>{formatStatValue(requestDocumentCount)}</strong>
                <span>Request-based</span>
              </article>
              <article className="detail-summary-tile">
                <strong>{formatStatValue(documentCards.length)}</strong>
                <span>Total file paths</span>
              </article>
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
          <article className="info-card detail-panel-card">
            <div className="detail-panel-heading">
              <div className="detail-panel-copy">
                <span className="card-kicker">Field feedback</span>
                <h2 className="detail-panel-title">Application notes and buyer feedback are handled through a guided review loop.</h2>
              </div>
              <div className="detail-panel-badges">
                <span className="detail-panel-badge">No public reviews yet</span>
              </div>
            </div>

            <div className="field-feedback-hero">
              <p className="section-description">This SKU has not accumulated enough published buyer reviews yet, but we can still support validation through engineering dialogue, sample evaluation and application-specific references.</p>
            </div>

            <div className="field-feedback-grid">
              <article className="field-feedback-card">
                <strong>Application matching</strong>
                <p>Discuss frame size, torque reserve, driver pairing and load profile before release.</p>
              </article>
              <article className="field-feedback-card">
                <strong>Pilot sample feedback</strong>
                <p>Use sample runs to confirm vibration, temperature and mounting suitability in the real machine.</p>
              </article>
              <article className="field-feedback-card">
                <strong>Procurement handoff</strong>
                <p>Once validated, we align the same SKU or custom derivative into sample, pilot and batch purchasing.</p>
              </article>
            </div>

            <div className="field-feedback-actions">
              <Link href={contactPath} className="button-secondary">
                Contact us with your application
              </Link>
              <Link href={quoteHref} className="detail-inline-link">
                Request evaluation support
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
import Link from 'next/link';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { ProductInquiryForm } from '@/components/storefront/product-inquiry-form';
import { buildMetadata } from '@/lib/seo';
import { getSeedProductById } from '@/server/storefront/seed';

export const metadata = buildMetadata({
  title: 'Contact Sales & Engineering — STEPMOTECH',
  description: 'Reach STEPMOTECH for pricing, MOQ, export shipping, custom assemblies, and broader OEM sourcing requests.',
  path: '/contact',
});

const supportChannels = [
  'Sales inquiries for pricing, MOQ, and export shipping coordination.',
  'Engineering follow-up for custom assemblies and integration requirements.',
  'Catalog support for stock status, compatible drivers, and accessory selection.',
  'Post-order coordination for logistics updates and documentation requests.',
];

const responseCommitments = [
  'Guest and logged-in inquiry submission are both supported by the current storefront flow.',
  'Use product pages for RFQs when the request is tied to a specific SKU or configured assembly.',
  'Use this page for broader sourcing requests such as OEM bundles, replacement projects, or mixed-part demand.',
  'Share quantity band, lead-time target, and delivery region so the sales team can respond with the right quote path.',
];

const rfqChecklist = [
  'Prototype and pilot builds that are too early for instant checkout.',
  'Mixed-part demand where motors, drivers, power supplies, and accessories must be quoted together.',
  'OEM requests that need drawings, compliance files, or engineering review before order release.',
  'Projects where MOQ, warehouse availability, and export routing all affect the purchasing decision.',
];

export default async function ContactPage() {
  const rfqProduct = getSeedProductById('prod-3');

  if (!rfqProduct) {
    return null;
  }

  return (
    <StorefrontFrame
      eyebrow="Contact & RFQ"
      title="Route a purchasing question, submit an RFQ, or align technical scope before release."
      description="This page now works as the general RFQ desk for small wholesale buying: bundle questions, OEM review, lead-time checks, and pre-sales coordination all feed into the same inquiry workflow."
      actions={
        <>
          <Link href="/products" className="button-primary">
            Browse Catalog
          </Link>
          <Link href="/support" className="button-secondary page-button-secondary-dark">
            Open Help Center
          </Link>
        </>
      }
    >
      <section className="section">
        <div className="section-inner story-grid">
          <article className="story-card story-card-accent">
            <div className="card-kicker">Best path for mixed procurement</div>
            <h2 className="section-title">Use this desk when the quote is broader than one SKU and needs a sales or engineering handoff.</h2>
            <p className="section-description">
              It mirrors the practical hybrid model used by small wholesale industrial sites: standard items can be bought directly, while bundled, custom, or uncertain requirements move into RFQ review.
            </p>
          </article>
          <article className="story-card">
            <div className="card-kicker">Good fit for</div>
            <div className="support-list">
              {rfqChecklist.map((item) => (
                <div key={item} className="support-item">
                  <span className="support-bullet" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-inner trade-flow-grid">
          <article className="info-card checkout-step-card">
            <div className="section-header trade-card-header">
              <div>
                <h2 className="cart-section-title">General RFQ Intake</h2>
                <p className="section-description">Send a consolidated request when the quote spans multiple parts, a custom assembly, or a sourcing discussion that should start before a cart order.</p>
              </div>
              <span className="product-badge">Sales desk</span>
            </div>
            <ProductInquiryForm
              productId={rfqProduct.id}
              productName={rfqProduct.name}
              mode="rfq"
              submitLabel="Send RFQ"
              successMessage="RFQ submitted. Sales will review the scope and reply with the right quote path."
              contextNote="This general RFQ channel routes bundle requests, OEM projects, and other quotation-led demand into the same inquiry queue."
            />
          </article>

          <div className="trade-side-stack">
            <article className="info-card">
              <h2 className="section-title">Response expectations</h2>
              <div className="support-list">
                {responseCommitments.map((item) => (
                  <div key={item} className="support-item">
                    <span className="support-bullet" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="info-card">
              <h2 className="section-title">Support coverage</h2>
              <div className="support-list">
                {supportChannels.map((item) => (
                  <div key={item} className="support-item">
                    <span className="support-bullet" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="info-card">
              <h2 className="section-title">Quick links</h2>
              <div className="inline-link-list">
                <Link href="/products" className="section-link">
                  Browse all products
                </Link>
                <Link href="/search" className="section-link">
                  Search by keyword
                </Link>
                <Link href="/support/after-sales" className="section-link">
                  After-sales support
                </Link>
                <Link href="/products/integrated-motion-assembly-oem" className="section-link">
                  Open the OEM inquiry product
                </Link>
                <Link href="/account/inquiries" className="section-link">
                  Review submitted inquiries
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </StorefrontFrame>
  );
}

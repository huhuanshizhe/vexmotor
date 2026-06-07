import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildMetadata } from '@/lib/seo';
import { getCurrentUserId } from '@/server/auth/session';
import { getGuestInquiryAccessCookieName, getStorefrontInquiryDetail } from '@/server/storefront/inquiries';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();
  return buildMetadata({
  title: 'Inquiry — STEPMOTECH',
  description: 'Buyer-facing RFQ snapshot.',
  path: '/inquiries',
  noIndex: true,
    locale,
  });
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ inquiryId: string }> }) {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();
  const { inquiryId } = await params;

  const inquiry = await getStorefrontInquiryDetail({
    inquiryId,
    userId,
    guestAccessToken: cookieStore.get(getGuestInquiryAccessCookieName(inquiryId))?.value ?? null,
  });

  if (!inquiry) {
    notFound();
  }

  const shortReference = inquiry.id.slice(0, 8).toUpperCase();
  const messageLines = inquiry.message.split('\n').map((line) => line.trim()).filter(Boolean);
  const extractedFields = {
    estimatedQuantity: messageLines.find((line) => line.startsWith('Estimated Quantity:'))?.replace('Estimated Quantity:', '').trim() ?? null,
    targetLeadTime: messageLines.find((line) => line.startsWith('Target Lead Time:'))?.replace('Target Lead Time:', '').trim() ?? null,
  };
  const requestNarrative = messageLines
    .filter((line) => !line.startsWith('Estimated Quantity:') && !line.startsWith('Target Lead Time:'))
    .join('\n');

  return (
    <StorefrontFrame
      eyebrow="Inquiry Received"
      title={`Inquiry ${shortReference} is queued for review.`}
      description="This page preserves the buyer-facing RFQ snapshot: product context, submitted contact information, and the exact request that sales or engineering will review next."
      actions={
        <>
          <Link href={`/products/${inquiry.productSlug}`} className="button-primary">
            Open Product
          </Link>
          <Link href="/contact" className="button-secondary page-button-secondary-dark">
            Submit Another RFQ
          </Link>
        </>
      }
    >
      <section className="section">
        <div className="section-inner trade-flow-grid">
          <div className="trade-main-stack">
            <article className="info-card checkout-step-card" style={{ display: 'grid', gap: 18 }}>
              <div className="section-header trade-card-header">
                <div>
                  <h2 className="cart-section-title">Request Snapshot</h2>
                  <p className="section-description">
                    Status: {inquiry.status} · Submitted {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="product-badge">Ref {shortReference}</span>
              </div>

              <div className="checkout-summary-items">
                <div className="checkout-summary-item">
                  <div>
                    <strong>{inquiry.productName}</strong>
                    <div className="product-meta">{inquiry.productSku}</div>
                  </div>
                  <Link href={`/products/${inquiry.productSlug}`} className="nav-link">
                    View product
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 8 }}>
                <h3 style={{ margin: 0 }}>Submitted Request</h3>
                <p className="section-description" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {requestNarrative || inquiry.message}
                </p>
              </div>

              {extractedFields.estimatedQuantity || extractedFields.targetLeadTime ? (
                <div className="info-grid">
                  {extractedFields.estimatedQuantity ? (
                    <article className="info-card" style={{ display: 'grid', gap: 6 }}>
                      <span className="product-meta">Estimated Quantity</span>
                      <strong>{extractedFields.estimatedQuantity}</strong>
                    </article>
                  ) : null}
                  {extractedFields.targetLeadTime ? (
                    <article className="info-card" style={{ display: 'grid', gap: 6 }}>
                      <span className="product-meta">Target Lead Time</span>
                      <strong>{extractedFields.targetLeadTime}</strong>
                    </article>
                  ) : null}
                </div>
              ) : null}

              {inquiry.sourcePageUrl ? (
                <div style={{ display: 'grid', gap: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
                  <h3 style={{ margin: 0 }}>Submission Context</h3>
                  <p className="section-description" style={{ margin: 0 }}>
                    This RFQ was submitted from {inquiry.sourcePageUrl}.
                  </p>
                </div>
              ) : null}
            </article>
          </div>

          <aside className="trade-side-stack">
            <article className="info-card checkout-summary-card" style={{ display: 'grid', gap: 18 }}>
              <div>
                <h2 className="cart-section-title" style={{ marginTop: 0 }}>Buyer Contact</h2>
                <div className="section-description">
                  <div>{inquiry.fullName}</div>
                  <div>{inquiry.email}</div>
                  {inquiry.phone ? <div>{inquiry.phone}</div> : null}
                  {inquiry.company ? <div>{inquiry.company}</div> : null}
                  {inquiry.country ? <div>{inquiry.country}</div> : null}
                </div>
              </div>

              <div className="support-list">
                <div className="support-item">
                  <span className="support-bullet" />
                  <span>Use this reference when following up on pricing, drawings, MOQ, or engineering review.</span>
                </div>
                <div className="support-item">
                  <span className="support-bullet" />
                  <span>Sales can translate this RFQ into a quote path, sample order, or direct-buy recommendation depending on scope.</span>
                </div>
                <div className="support-item">
                  <span className="support-bullet" />
                  <span>{userId ? 'Your account inquiry list will continue tracking this request as it moves forward.' : 'You can keep this page for guest-side review before creating an account.'}</span>
                </div>
              </div>

              {userId ? (
                <Link href="/account/inquiries" className="nav-link">
                  Review all inquiries
                </Link>
              ) : null}
            </article>
          </aside>
        </div>
      </section>
    </StorefrontFrame>
  );
}
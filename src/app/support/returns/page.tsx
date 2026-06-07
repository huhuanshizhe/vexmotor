import Link from 'next/link';
import { notFound } from 'next/navigation';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { JsonLdScript } from '@/components/seo/json-ld';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { getCurrentUserId } from '@/server/auth/session';
import { getSupportPageBySlug } from '@/server/content/support';
import { getOrdersByUser } from '@/server/storefront/account';

const rmaSteps = [
  {
    title: 'Open RMA',
    note: 'Choose the affected order, open the RMA handoff, and describe whether the case is defect, wrong item, damage, or warranty review.',
  },
  {
    title: 'Receive label or routing',
    note: 'Support confirms whether return freight is covered, whether an RMA number is required, and which lane or warehouse should receive the goods.',
  },
  {
    title: 'Ship back with evidence',
    note: 'Use the approved route, keep packaging when possible, and attach the visual evidence set if the request is tied to a defect or shipping issue.',
  },
  {
    title: 'Refund or replace',
    note: 'After inspection, the case moves into refund, replacement, or paid-repair handling depending on the approved outcome and policy scope.',
  },
] as const;

const nonReturnable = [
  'Returned goods can be refused when no approved RMA or support confirmation exists before shipment.',
  'Initial export postage, packaging charges, and some handling deductions remain non-refundable even when a return is approved.',
  'Change-of-mind or procurement-plan changes remain customer-paid return scenarios unless the shipment was wrong or defective.',
  'Issues caused by misuse, unauthorized modification, disassembly, electrical overstress, or damage outside normal industrial use are outside standard warranty handling.',
] as const;

const faq = [
  {
    question: 'When does StepMotech pay return freight?',
    answer: 'Return freight is normally covered when a confirmed quality defect or wrong-item shipment is established. Change-of-mind or demand-change returns remain customer-paid.',
  },
  {
    question: 'How fast are refunds processed?',
    answer: 'Approved refunds are typically issued within 2 business days after inspection, with settlement timing then depending on the payment provider.',
  },
  {
    question: 'What if the issue is not clearly a return yet?',
    answer: 'Start with after-sales or the order-issue contact path when the case still needs diagnosis, compatibility review, or a decision between repair, replacement, and return.',
  },
] as const;

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();
  return buildMetadata({
  title: 'Returns & Warranty — STEPMOTECH',
  description: 'Return timing, RMA workflow, warranty scope, exclusions, and order-linked support handoff for refunds, replacements, and repair review.',
  path: '/support/returns',
    locale,
  });
}

export default async function ReturnsWarrantyPage() {
  const { locale } = await getServerSitePreferences();
  const userId = await getCurrentUserId();
  const orders = userId ? await getOrdersByUser(userId) : [];
  const latestOrder = orders[0] ?? null;
  const [returnsPolicy, warrantyPolicy] = await Promise.all([
    getSupportPageBySlug('returns'),
    getSupportPageBySlug('terms-and-conditions'),
  ]);

  if (!returnsPolicy || !warrantyPolicy) {
    notFound();
  }

  const approvedReturnSection = returnsPolicy.sections.find((section) => section.title === 'Approved Return Scenarios');
  const deductionsSection = returnsPolicy.sections.find((section) => section.title === 'Deductions, Inspection, and Rights');
  const qualitySection = warrantyPolicy.sections.find((section) => section.title === 'Cancellation and Quality Issues');
  const warrantySection = warrantyPolicy.sections.find((section) => section.title === 'Warranty and Lifetime Support');

  if (!approvedReturnSection || !deductionsSection || !qualitySection || !warrantySection) {
    notFound();
  }

  const accountOrdersPath = withLocalePath('/account/orders', locale);
  const loginPath = `${withLocalePath('/login', locale)}?callbackUrl=${encodeURIComponent(accountOrdersPath)}`;
  const openRmaPath = latestOrder ? `${withLocalePath(`/account/orders/${latestOrder.orderNumber}`, locale)}?action=rma` : userId ? accountOrdersPath : loginPath;
  const openRmaLabel = latestOrder ? `Open RMA for ${latestOrder.orderNumber}` : userId ? 'Open RMA from order history' : 'Sign in to open RMA';

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: 'Home', path: '/' },
      { name: 'Support', path: '/support' },
      { name: 'Returns & Warranty', path: '/support/returns' },
    ],
    locale,
  );
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <StorefrontFrame
      eyebrow="Support"
      title="Returns and warranty guidance for refund, replacement, and repair-path decisions."
      description="Use this page to check return timing, warranty scope, exclusions, and the order-linked RMA handoff before sending product back or escalating a field issue."
      actions={
        <>
          <Link href={openRmaPath} className="button-primary">
            {openRmaLabel}
          </Link>
          <Link href={withLocalePath('/support/contact?topic=order-issue', locale)} className="button-secondary page-button-secondary-dark">
            Contact Order Support
          </Link>
        </>
      }
    >
      <JsonLdScript id="returns-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLdScript id="returns-faq-jsonld" data={faqJsonLd} />

      <section className="section">
        <div className="section-inner returns-summary-grid">
          <article className="summary-stat">
            <span className="summary-label">Return window</span>
            <strong>30 calendar days</strong>
            <span className="section-description compact-copy">Return requests must be opened within 30 days of receiving the order.</span>
          </article>
          <article className="summary-stat">
            <span className="summary-label">Warranty policy</span>
            <strong>3-year coverage</strong>
            <span className="section-description compact-copy">The current legacy terms reference 3-year warranty handling for qualifying failures under normal use.</span>
          </article>
          <article className="summary-stat">
            <span className="summary-label">Support beyond warranty</span>
            <strong>Lifetime technical support</strong>
            <span className="section-description compact-copy">Paid repair or service options can still be reviewed after warranty, with charges disclosed before work starts.</span>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-inner trade-flow-grid">
          <div className="trade-main-stack">
            <article className="info-card returns-step-card">
              <div className="section-header trade-card-header">
                <div>
                  <div className="card-kicker">RMA flow</div>
                  <h2 className="cart-section-title">Four-step return path</h2>
                  <p className="section-description">The return flow stays tied to a real order so support can validate freight responsibility, inspection handling, and the correct warehouse destination.</p>
                </div>
              </div>

              <div className="returns-step-grid">
                {rmaSteps.map((step, index) => (
                  <article key={step.title} className="summary-stat">
                    <span className="summary-label">Step {index + 1}</span>
                    <strong>{step.title}</strong>
                    <span className="section-description compact-copy">{step.note}</span>
                  </article>
                ))}
              </div>
            </article>

            <article className="info-card returns-step-card">
              <div className="section-header trade-card-header">
                <div>
                  <div className="card-kicker">Policy details</div>
                  <h2 className="cart-section-title">Return and warranty scope</h2>
                </div>
              </div>

              <div className="returns-policy-grid">
                <article className="info-card">
                  <h3 style={{ marginTop: 0 }}>Approved return scenarios</h3>
                  <div className="support-list">
                    {approvedReturnSection.bullets?.map((item) => (
                      <div key={item} className="support-item">
                        <span className="support-bullet" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="info-card">
                  <h3 style={{ marginTop: 0 }}>Deductions and inspection</h3>
                  <div className="support-list">
                    {deductionsSection.paragraphs?.map((item) => (
                      <div key={item} className="support-item">
                        <span className="support-bullet" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="info-card">
                  <h3 style={{ marginTop: 0 }}>Damage and wrong-item handling</h3>
                  <div className="support-list">
                    {qualitySection.bullets?.map((item) => (
                      <div key={item} className="support-item">
                        <span className="support-bullet" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="info-card">
                  <h3 style={{ marginTop: 0 }}>Warranty and lifetime support</h3>
                  <div className="support-list">
                    {warrantySection.bullets?.map((item) => (
                      <div key={item} className="support-item">
                        <span className="support-bullet" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </article>
          </div>

          <aside className="trade-side-stack">
            <article className="info-card returns-step-card">
              <div className="card-kicker">Open RMA</div>
              <h2 className="cart-section-title">Order-linked handoff</h2>
              <p className="section-description">RMA requests are anchored to a specific order so support can confirm shipment history, line items, and the right return lane before goods are sent back.</p>
              <div className="trade-empty-actions">
                <Link href={openRmaPath} className="button-primary">
                  {openRmaLabel}
                </Link>
                <Link href={withLocalePath('/account/orders', locale)} className="button-secondary">
                  View Orders
                </Link>
              </div>
              <p className="section-description compact-copy">
                {latestOrder
                  ? `Your latest available order is ${latestOrder.orderNumber}. Open it directly in RMA mode if that is the affected shipment.`
                  : userId
                    ? 'Choose the relevant order from your history before opening the RMA handoff.'
                    : 'Sign in first, then pick the affected order from your account history.'}
              </p>
            </article>

            <article className="info-card returns-step-card">
              <div className="card-kicker">Not returnable</div>
              <h2 className="cart-section-title">Cases that usually fall outside standard return approval</h2>
              <div className="support-list">
                {nonReturnable.map((item) => (
                  <div key={item} className="support-item">
                    <span className="support-bullet" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="info-card returns-step-card">
              <div className="card-kicker">Escalation</div>
              <h2 className="cart-section-title">When to switch to another support path</h2>
              <div className="inline-link-list">
                <Link href={withLocalePath('/support/after-sales', locale)} className="section-link">
                  After-sales Support
                </Link>
                <Link href={withLocalePath('/support/contact?topic=order-issue', locale)} className="section-link">
                  Order-Issue Contact
                </Link>
                <Link href={withLocalePath('/support/shipping', locale)} className="section-link">
                  Shipping & Customs
                </Link>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <article className="info-card returns-step-card">
            <div className="card-kicker">FAQ</div>
            <h2 className="cart-section-title">Common return and warranty questions</h2>
            <div className="custom-faq-grid">
              {faq.map((item) => (
                <article key={item.question} className="custom-faq-card">
                  <strong>{item.question}</strong>
                  <p className="section-description compact-copy">{item.answer}</p>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>
    </StorefrontFrame>
  );
}
import Link from 'next/link';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { JsonLdScript } from '@/components/seo/json-ld';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildBreadcrumbJsonLd, buildMetadata, buildOrganizationJsonLd } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About STEPMOTECH — Factory-direct motion engineering',
  description:
    'Our mission, story, capacity by the numbers, leadership, and values as a factory-direct supplier of stepper motors, drivers, and matched motion systems.',
  path: '/company/about',
  type: 'website',
});

const milestones = [
  { year: '2009', label: 'Founded', detail: 'Started as a stepper-motor winding workshop serving regional automation builders.' },
  { year: '2014', label: 'Driver line', detail: 'Added matched driver and controller production to ship complete motion sets.' },
  { year: '2018', label: 'Export program', detail: 'Opened export-compliant logistics with duty-inclusive routes for OEM buyers.' },
  { year: '2022', label: 'Direct storefront', detail: 'Launched the direct catalog and RFQ platform for distributors and engineers.' },
  { year: '2026', label: 'Today', detail: 'A hybrid catalog and project-sourcing partner across global motion markets.' },
];

const stats = [
  { label: 'Employees', value: '480+' },
  { label: 'Factory area', value: '32,000 m²' },
  { label: 'Monthly capacity', value: '120k units' },
  { label: 'Customer countries', value: '60+' },
  { label: 'Catalog SKUs', value: '2,400+' },
];

const leadership = [
  { name: 'L. Wen', role: 'Chief Executive Officer', bio: 'Two decades in motion manufacturing, focused on factory-direct quality and export readiness.' },
  { name: 'M. Aigner', role: 'VP Engineering', bio: 'Leads motor and driver design, datasheet accuracy, and application sizing support.' },
  { name: 'S. Ferraro', role: 'Director of Customer Operations', bio: 'Owns the RFQ, credit, and after-sales experience for B2B accounts.' },
];

const values = [
  { title: 'Precision', detail: 'Specifications are measured, documented, and verifiable — not marketing rounding.' },
  { title: 'Engineering', detail: 'We support sizing decisions with real torque, inertia, and thermal guidance.' },
  { title: 'Customer', detail: 'Catalog speed for repeat orders, structured RFQ care for complex projects.' },
  { title: 'Sustainability', detail: 'Efficient drives and right-sized motors reduce energy and material waste.' },
];

const press = [
  { year: '2025', title: 'Motion Components Award — Best Stepper Driver Series', source: 'Industrial Automation Review' },
  { year: '2024', title: 'Featured supplier in cross-border OEM sourcing report', source: 'Global Manufacturing Weekly' },
  { year: '2023', title: 'ISO quality program profile', source: 'Precision Engineering Journal' },
];

export default async function CompanyAboutPage() {
  const { locale } = await getServerSitePreferences();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    [
      { name: 'Home', path: '/' },
      { name: 'Company', path: '/company/about' },
      { name: 'About', path: '/company/about' },
    ],
    locale,
  );

  const aboutPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About STEPMOTECH',
    description:
      'Factory-direct supplier of stepper motors, drivers, and matched motion systems serving OEM and distribution markets worldwide.',
  };

  return (
    <StorefrontFrame
      eyebrow="Company"
      title="Engineering motion you can specify, source, and trust — straight from the factory."
      description="STEPMOTECH builds stepper motors, drivers, and matched motion systems and sells them direct: fast for catalog reorders, structured for engineering-led RFQs and export procurement."
      actions={
        <>
          <Link href={withLocalePath('/company/careers', locale)} className="button-primary">
            Careers
          </Link>
          <Link href={withLocalePath('/company/factory', locale)} className="button-secondary page-button-secondary-dark">
            Factory Tour
          </Link>
        </>
      }
    >
      <JsonLdScript id="company-about-organization-jsonld" data={buildOrganizationJsonLd()} />
      <JsonLdScript id="company-about-aboutpage-jsonld" data={aboutPageJsonLd} />
      <JsonLdScript id="company-about-breadcrumb-jsonld" data={breadcrumbJsonLd} />

      <section className="section">
        <div className="section-inner story-grid">
          <article className="story-card story-card-accent">
            <div className="card-kicker">Our mission</div>
            <h2 className="section-title">Make precise motion sourcing simple for the people who build machines.</h2>
            <p className="section-description">
              We pair manufacturing depth with a transparent catalog and responsive engineering support so buyers can move from specification to delivery
              without guesswork.
            </p>
          </article>
          <article className="story-card">
            <div className="card-kicker">What we make</div>
            <div className="support-list">
              {['Stepper motors across NEMA frames', 'Matched drivers and controllers', 'Custom and OEM motion assemblies', 'Application sizing and after-sales support'].map((item) => (
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
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Our story</h2>
              <p className="section-description">From a single winding workshop to a direct global motion supplier.</p>
            </div>
          </div>
          <div className="about-timeline">
            {milestones.map((item) => (
              <article key={item.year} className="about-timeline-item">
                <strong className="about-timeline-year">{item.year}</strong>
                <div>
                  <div className="card-kicker">{item.label}</div>
                  <p className="section-description" style={{ margin: 0 }}>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">By the numbers</h2>
              <p className="section-description">A snapshot of the manufacturing and commercial footprint behind every order.</p>
            </div>
          </div>
          <div className="trust-grid about-stat-grid">
            {stats.map((item) => (
              <article key={item.label} className="trust-card">
                <strong className="about-stat">{item.value}</strong>
                <div className="card-kicker">{item.label}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Leadership</h2>
              <p className="section-description">The team accountable for product quality, engineering support, and customer operations.</p>
            </div>
          </div>
          <div className="trust-grid">
            {leadership.map((person) => (
              <article key={person.name} className="trust-card">
                <div className="about-avatar" aria-hidden="true">{person.name.charAt(0)}</div>
                <strong>{person.name}</strong>
                <div className="card-kicker">{person.role}</div>
                <p className="section-description" style={{ marginBottom: 0 }}>{person.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">What we value</h2>
              <p className="section-description">Principles that shape how we engineer, document, and support motion products.</p>
            </div>
          </div>
          <div className="trust-grid">
            {values.map((value) => (
              <article key={value.title} className="trust-card">
                <div className="card-kicker">{value.title}</div>
                <p className="section-description" style={{ marginBottom: 0 }}>{value.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Press &amp; awards</h2>
              <p className="section-description">Recognition and coverage of our products and quality program.</p>
            </div>
          </div>
          <div className="support-list">
            {press.map((item) => (
              <div key={item.title} className="support-item">
                <span className="support-bullet" />
                <span>
                  <strong>{item.year}</strong> — {item.title} · <em>{item.source}</em>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner story-grid">
          <article className="story-card story-card-accent">
            <div className="card-kicker">Join or visit</div>
            <h2 className="section-title">Work with us or see how it’s built.</h2>
            <p className="section-description">Explore open roles or book a factory tour to review the production process behind our motion systems.</p>
            <div className="trade-empty-actions">
              <Link href={withLocalePath('/company/careers', locale)} className="button-primary">
                View Careers
              </Link>
              <Link href={withLocalePath('/company/factory', locale)} className="button-secondary page-button-secondary-dark">
                Book a Factory Tour
              </Link>
            </div>
          </article>
        </div>
      </section>
    </StorefrontFrame>
  );
}

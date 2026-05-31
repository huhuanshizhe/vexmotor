import Link from 'next/link';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { JsonLdScript } from '@/components/seo/json-ld';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';
import { getKnowledgeCatalog } from '@/server/content/knowledge';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();

  return buildMetadata({
    title: 'FAQ — STEPMOTECH',
    description: 'Answers for catalog orders, inquiry workflows, and industrial sourcing questions across direct-buy and RFQ-mode products.',
    path: '/faq',
    locale,
  });
}

export default async function FaqPage() {
  const [{ locale }, knowledgeCatalog] = await Promise.all([getServerSitePreferences(), getKnowledgeCatalog()]);
  const pageUrl = `${SITE_URL}${withLocalePath('/faq', locale)}`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ], locale);
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `${SITE_NAME} FAQ`,
    description: 'Answers for catalog orders, inquiry workflows, and industrial sourcing questions.',
    url: pageUrl,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: knowledgeCatalog.storefrontFaqs.map((item) => ({
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
      eyebrow="FAQ"
      title="Answers for catalog orders, inquiry workflows, and industrial sourcing questions."
      description="This page covers the operational differences between direct-buy products and RFQ-mode products, together with common pre-sales expectations."
      actions={
        <>
          <Link href={withLocalePath('/tech-faq', locale)} className="button-secondary page-button-secondary-dark">
            Technical FAQ
          </Link>
          <Link href={withLocalePath('/support/contact?topic=sales', locale)} className="button-primary">
            Contact support
          </Link>
        </>
      }
    >
      <JsonLdScript id="faq-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLdScript id="faq-jsonld" data={faqJsonLd} />
      <section className="section">
        <div className="section-inner info-grid">
          {knowledgeCatalog.storefrontFaqs.map((item) => (
            <article key={item.id} id={`q-${item.id}`} className="info-card">
              <div className="product-card-top">
                <span className="product-badge">Storefront FAQ</span>
                <a href={`#q-${item.id}`} className="section-link">Deep link</a>
              </div>
              <h2 style={{ margin: 0 }}>{item.question}</h2>
              <p className="section-description">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </StorefrontFrame>
  );
}

import Link from 'next/link';

import { StorefrontFrame } from '@/components/layout/storefront-frame';
import { JsonLdScript } from '@/components/seo/json-ld';
import { TechFaqClient } from '@/components/storefront/tech-faq-client';
import { techFaqEntryToPlainText, type KnowledgeLinkedProduct } from '@/lib/knowledge';
import { withLocalePath } from '@/lib/i18n';
import { getServerSitePreferences } from '@/lib/i18n-server';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';
import { getKnowledgeCatalog } from '@/server/content/knowledge';
import { getProductBySlug, type StorefrontProductDetail } from '@/server/storefront';

export async function generateMetadata() {
  const { locale } = await getServerSitePreferences();

  return buildMetadata({
    title: 'Technical FAQ — STEPMOTECH',
    description: 'Searchable engineering FAQ for sizing, wiring, drivers, compliance, shipping, and motion-control troubleshooting.',
    path: '/tech-faq',
    locale,
  });
}

function buildKnowledgeProductMap(products: StorefrontProductDetail[]) {
  return products.reduce<Record<string, KnowledgeLinkedProduct>>((accumulator, product) => {
    accumulator[product.slug] = {
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      purchaseMode: product.purchaseMode,
      priceLabel: product.purchaseMode === 'buy' ? product.price.formatted : 'Request Quote',
      shortDescription: product.shortDescription ?? undefined,
    };
    return accumulator;
  }, {});
}

export default async function TechFaqPage() {
  const { locale } = await getServerSitePreferences();
  const knowledgeCatalog = await getKnowledgeCatalog();
  const productSlugs = Array.from(new Set(knowledgeCatalog.techFaqEntries.flatMap((entry) => entry.relatedProductSlugs).concat(knowledgeCatalog.glossaryTerms.flatMap((term) => term.relatedProductSlugs))));
  const products = await Promise.all(productSlugs.map((slug) => getProductBySlug(slug)));
  const productMap = buildKnowledgeProductMap(products.filter((product): product is StorefrontProductDetail => Boolean(product)));
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Technical FAQ', path: '/tech-faq' },
  ], locale);
  const pageUrl = `${SITE_URL}${withLocalePath('/tech-faq', locale)}`;
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `${SITE_NAME} Technical FAQ`,
    description: 'Engineering FAQ entries covering sizing, wiring, compliance, shipping, and motion-control troubleshooting.',
    url: pageUrl,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: knowledgeCatalog.techFaqEntries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: techFaqEntryToPlainText(entry),
      },
    })),
  };

  return (
    <StorefrontFrame
      eyebrow="Technical FAQ"
      title="Motion answers for sizing, wiring, compliance, shipping, and commissioning questions."
      description="Use the technical FAQ when the issue is already specific enough to search by symptom, subsystem, or engineering term before opening a live ticket."
      actions={
        <>
          <Link href={withLocalePath('/glossary', locale)} className="button-secondary page-button-secondary-dark">
            Open glossary
          </Link>
          <Link href={withLocalePath('/support/contact?topic=technical', locale)} className="button-primary">
            Ask engineering
          </Link>
        </>
      }
    >
      <JsonLdScript id="tech-faq-breadcrumb-jsonld" data={breadcrumbJsonLd} />
      <JsonLdScript id="tech-faq-page-jsonld" data={faqJsonLd} />

      <section className="section">
        <div className="section-inner knowledge-page-shell">
          <TechFaqClient
            locale={locale}
            productsBySlug={productMap}
            glossaryTerms={knowledgeCatalog.glossaryTerms}
            techFaqCategories={knowledgeCatalog.techFaqCategories}
            techFaqEntries={knowledgeCatalog.techFaqEntries}
          />
        </div>
      </section>
    </StorefrontFrame>
  );
}
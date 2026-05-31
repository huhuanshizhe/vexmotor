import type { Metadata } from 'next';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale, withLocalePath } from '@/lib/i18n';
import { DEFAULT_SEO_DESCRIPTION, DEFAULT_SEO_TITLE, SITE_NAME, SITE_URL } from '@/lib/site-config';

type SeoImage = {
  url: string;
  alt?: string;
};

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  locale?: Locale;
  type?: 'website' | 'article';
  images?: SeoImage[];
  noIndex?: boolean;
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}

function buildAlternateLanguages(pathname: string) {
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, toAbsoluteUrl(withLocalePath(pathname, locale))]),
  );

  return {
    ...languages,
    'x-default': toAbsoluteUrl(withLocalePath(pathname, DEFAULT_LOCALE)),
  };
}

export function buildMetadata({
  title = DEFAULT_SEO_TITLE,
  description = DEFAULT_SEO_DESCRIPTION,
  path = '/',
  locale = DEFAULT_LOCALE,
  type = 'website',
  images,
  noIndex = false,
}: SeoInput = {}): Metadata {
  const localizedPath = withLocalePath(path, locale);
  const canonical = toAbsoluteUrl(localizedPath);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: buildAlternateLanguages(path),
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      images: images?.length ? images : undefined,
    },
    twitter: {
      card: images?.length ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images?.length ? [images[0].url] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    brand: SITE_NAME,
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?keyword={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], locale: Locale = DEFAULT_LOCALE) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(withLocalePath(item.path, locale)),
    })),
  };
}
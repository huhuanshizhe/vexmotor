import type { MetadataRoute } from 'next';

import { applicationCaseStudies } from '@/lib/applications';
import { careerRoles } from '@/lib/careers';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, withLocalePath } from '@/lib/i18n';
import { legalPages } from '@/lib/legal-content';
import { resourceSections } from '@/lib/resources';
import { SITE_URL } from '@/lib/site-config';
import { getPublishedBlogPosts } from '@/server/content/blog';
import { getSupportCatalog } from '@/server/content/support';
import { getCategories, getProductList } from '@/server/storefront';

function toAbsoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products, blogPosts, supportCatalog] = await Promise.all([
    getCategories(),
    getProductList({ page: 1, pageSize: 1000 }),
    getPublishedBlogPosts(),
    getSupportCatalog(),
  ]);

  const staticRoutes = [
    '/',
    '/products',
    '/support',
    '/solutions',
    '/selector',
    '/custom',
    '/volume-pricing',
    '/contact',
    '/faq',
    '/tech-faq',
    '/glossary',
    '/company/about',
    '/company/certifications',
    '/company/factory',
    '/company/distributors',
    '/company/careers',
    '/company/offices',
    '/company/press',
    '/applications',
    '/blog',
    '/resources',
    ...resourceSections.map((section) => `/resources/${section.slug}`),
  ];

  // Helper function to create multilingual sitemap entries
  const createMultilingualEntry = (path: string, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number) => {
    const entries: MetadataRoute.Sitemap = [];
    
    // Add entry for each supported locale
    SUPPORTED_LOCALES.forEach((locale) => {
      const localizedPath = withLocalePath(path, locale);
      const url = toAbsoluteUrl(localizedPath);
      
      entries.push({
        url,
        changeFrequency,
        priority,
        // Add alternate URLs for hreflang
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((altLocale) => [
              altLocale,
              toAbsoluteUrl(withLocalePath(path, altLocale)),
            ])
          ),
        },
      });
    });
    
    return entries;
  };

  return [
    // Static routes with multilingual support
    ...staticRoutes.flatMap((path) => 
      createMultilingualEntry(path, path === '/' ? 'daily' : 'weekly', path === '/' ? 1 : 0.7)
    ),
    ...careerRoles.map((role) => ({
      url: toAbsoluteUrl(`/company/careers/${role.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...blogPosts.map((post) => ({
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...applicationCaseStudies.map((caseStudy) => ({
      url: toAbsoluteUrl(`/applications/${caseStudy.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...supportCatalog.pages.map((page) => ({
      url: toAbsoluteUrl(`/support/${page.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...legalPages.map((page) => ({
      url: toAbsoluteUrl(`/legal/${page.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    })),
    // Categories with multilingual support
    ...categories.flatMap((category) => 
      createMultilingualEntry(`/c/${category.slug}`, 'weekly', 0.8)
    ),
    // Products with multilingual support
    ...products.items.flatMap((product) => 
      createMultilingualEntry(`/products/${product.slug}`, 'weekly', 0.8)
    ),
  ];
}
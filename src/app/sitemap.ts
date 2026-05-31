import type { MetadataRoute } from 'next';

import { applicationCaseStudies } from '@/lib/applications';
import { careerRoles } from '@/lib/careers';
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
    getProductList({ page: 1, pageSize: 200 }),
    getPublishedBlogPosts(),
    getSupportCatalog(),
  ]);

  const staticRoutes = [
    '/',
    '/products',
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

  return [
    ...staticRoutes.map((path) => ({
      url: toAbsoluteUrl(path),
      changeFrequency: path === '/' ? ('daily' as const) : ('weekly' as const),
      priority: path === '/' ? 1 : 0.7,
    })),
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
    ...categories.map((category) => ({
      url: toAbsoluteUrl(`/products?category=${category.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.items.map((product) => ({
      url: toAbsoluteUrl(`/products/${product.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
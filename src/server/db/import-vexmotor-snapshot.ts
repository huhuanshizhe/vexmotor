import '@/lib/env';

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { eq } from 'drizzle-orm';

import { db } from '@/server/db';
import {
  brands,
  categories,
  cmsPages,
  contentBlocks,
  editorialContentEntries,
  productCategories,
  productImages,
  products,
} from '@/server/db/schema';

type ProductSnapshot = {
  url: string;
  title?: string | null;
  heading?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ldProduct?: {
    name?: string | null;
    sku?: string | null;
    description?: string | null;
    brand?: string | null;
    price?: string | number | null;
    currency?: string | null;
    images?: string[];
  } | null;
};

type CategorySnapshot = {
  url: string;
  title?: string | null;
  heading?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type PageSnapshot = {
  url: string;
  title?: string | null;
  heading?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  bodyTextExcerpt?: string | null;
};

type FooterSnapshot = {
  html?: string;
  text?: string;
  links?: Array<{ href: string; label: string }>;
};

type BannerSnapshot = {
  images?: string[];
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/\.html$/g, '')
    .replace(/^-+|-+$/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-');
}

function categorySlugFromPath(pathname: string) {
  const segment = pathname.split('/').filter(Boolean)[0] ?? '';
  return normalizeSlug(segment.replace(/-\d+$/, ''));
}

function productSlugFromPath(pathname: string) {
  const segment = pathname.split('/').filter(Boolean).at(-1) ?? '';
  const withoutHtml = segment.replace(/\.html$/i, '');
  const withoutLeadId = withoutHtml.replace(/^\d+-/, '');
  const withoutTailNumeric = withoutLeadId.replace(/-\d{10,}$/, '');
  return normalizeSlug(withoutTailNumeric);
}

function pageSlugFromPath(pathname: string) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) {
    return 'home';
  }

  const segments = clean.split('/').filter(Boolean);
  const localePrefix = ['en', 'es', 'de', 'fr'].includes(segments[0] ?? '') ? segments[0] : null;
  const leaf = segments.at(-1) ?? clean;
  const normalizedLeaf = /^\d+-/.test(leaf) ? normalizeSlug(leaf.replace(/^\d+-/, '')) : normalizeSlug(leaf);

  if (localePrefix) {
    return `${localePrefix}-${normalizedLeaf}`;
  }

  if (/^\d+-/.test(leaf)) {
    return normalizeSlug(leaf.replace(/^\d+-/, ''));
  }

  return normalizedLeaf;
}

function toTitleCaseFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

async function loadJson<T>(baseDir: string, fileName: string): Promise<T> {
  const fullPath = path.join(baseDir, fileName);
  const raw = await readFile(fullPath, 'utf8');
  return JSON.parse(raw) as T;
}

async function upsertCategory(entry: CategorySnapshot) {
  const url = new URL(entry.url);
  const slug = categorySlugFromPath(url.pathname);
  if (!slug) {
    return null;
  }

  const name = (entry.heading || entry.title || toTitleCaseFromSlug(slug)).trim();
  const seoTitle = entry.seoTitle || entry.title || name;
  const seoDescription = entry.seoDescription || null;

  await db!
    .insert(categories)
    .values({
      name,
      slug,
      description: seoDescription,
      seoTitle,
      seoDescription,
      status: 'active',
    })
    .onConflictDoUpdate({
      target: categories.slug,
      set: {
        name,
        description: seoDescription,
        seoTitle,
        seoDescription,
        status: 'active',
        updatedAt: new Date(),
      },
    });

  const [saved] = await db!.select({ id: categories.id, slug: categories.slug }).from(categories).where(eq(categories.slug, slug)).limit(1);
  return saved ?? null;
}

async function main() {
  if (!db) {
    throw new Error('DATABASE_URL is required before running import script');
  }

  const inputDir = path.resolve(process.cwd(), process.argv[2] || 'migration/vexmotor');

  const [productsSnapshot, categoriesSnapshot, pagesSnapshot, articlesSnapshot, footerSnapshot, bannerSnapshot] = await Promise.all([
    loadJson<ProductSnapshot[]>(inputDir, 'products.json'),
    loadJson<CategorySnapshot[]>(inputDir, 'categories.json'),
    loadJson<PageSnapshot[]>(inputDir, 'pages.json'),
    loadJson<PageSnapshot[]>(inputDir, 'articles.json'),
    loadJson<FooterSnapshot>(inputDir, 'footer.json'),
    loadJson<BannerSnapshot>(inputDir, 'banner.json'),
  ]);

  const legacyBrandSlug = 'stepmotech';
  const legacyBrandName = 'StepMotech';

  await db!
    .insert(brands)
    .values({
      name: legacyBrandName,
      slug: legacyBrandSlug,
      description: 'Imported from legacy site during migration.',
      status: 'active',
    })
    .onConflictDoUpdate({
      target: brands.slug,
      set: {
        name: legacyBrandName,
        status: 'active',
        updatedAt: new Date(),
      },
    });

  const [brand] = await db!.select({ id: brands.id }).from(brands).where(eq(brands.slug, legacyBrandSlug)).limit(1);
  if (!brand) {
    throw new Error('Failed to resolve StepMotech brand record');
  }

  const categoryBySlug = new Map<string, string>();
  for (const item of categoriesSnapshot) {
    const row = await upsertCategory(item);
    if (row) {
      categoryBySlug.set(row.slug, row.id);
    }
  }

  let importedProducts = 0;
  for (const item of productsSnapshot) {
    if (!item.ldProduct?.name) {
      continue;
    }

    const url = new URL(item.url);
    const slug = productSlugFromPath(url.pathname);
    const categorySlug = categorySlugFromPath(url.pathname);
    const categoryId = categoryBySlug.get(categorySlug) ?? null;

    if (!slug) {
      continue;
    }

    const name = item.ldProduct.name.trim();
    const sku = (item.ldProduct.sku || slug).trim();
    const description = (item.ldProduct.description || item.seoDescription || '').trim();
    const shortDescription = (item.heading || item.seoDescription || '').trim();
    const price = Number(item.ldProduct.price ?? 0);
    const safePrice = Number.isFinite(price) ? price.toFixed(2) : '0.00';

    const [existingBySku] = await db!.select({ id: products.id, slug: products.slug }).from(products).where(eq(products.sku, sku)).limit(1);

    if (existingBySku && existingBySku.slug !== slug) {
      await db!
        .update(products)
        .set({
          brandId: brand.id,
          defaultCategoryId: categoryId,
          name,
          shortDescription: shortDescription || null,
          description: description || null,
          status: 'active',
          price: safePrice,
          currencyCode: item.ldProduct.currency || 'USD',
          seoTitle: item.seoTitle || item.title || name,
          seoDescription: item.seoDescription || null,
          updatedAt: new Date(),
        })
        .where(eq(products.id, existingBySku.id));
    } else {
      await db!
        .insert(products)
        .values({
          brandId: brand.id,
          defaultCategoryId: categoryId,
          name,
          slug,
          sku,
          shortDescription: shortDescription || null,
          description: description || null,
          purchaseMode: 'buy',
          status: 'active',
          price: safePrice,
          currencyCode: item.ldProduct.currency || 'USD',
          stockQuantity: 100,
          featured: false,
          seoTitle: item.seoTitle || item.title || name,
          seoDescription: item.seoDescription || null,
          publishedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            brandId: brand.id,
            defaultCategoryId: categoryId,
            name,
            shortDescription: shortDescription || null,
            description: description || null,
            status: 'active',
            price: safePrice,
            currencyCode: item.ldProduct.currency || 'USD',
            seoTitle: item.seoTitle || item.title || name,
            seoDescription: item.seoDescription || null,
            updatedAt: new Date(),
          },
        });
    }

    const [saved] = await db!
      .select({ id: products.id })
      .from(products)
      .where(existingBySku && existingBySku.slug !== slug ? eq(products.id, existingBySku.id) : eq(products.slug, slug))
      .limit(1);
    if (!saved) {
      continue;
    }

    if (categoryId) {
      await db!
        .insert(productCategories)
        .values({ productId: saved.id, categoryId })
        .onConflictDoNothing();
    }

    const imageUrl = item.ldProduct.images?.[0];
    if (imageUrl) {
      await db!
        .insert(productImages)
        .values({
          productId: saved.id,
          url: imageUrl,
          alt: item.heading || name,
          sortOrder: 1,
          isPrimary: true,
        })
        .onConflictDoNothing();
    }

    importedProducts += 1;
  }

  for (const item of pagesSnapshot) {
    const url = new URL(item.url);
    const slug = pageSlugFromPath(url.pathname);
    const title = (item.heading || item.title || toTitleCaseFromSlug(slug)).trim();

    await db!
      .insert(cmsPages)
      .values({
        title,
        slug,
        summary: item.seoDescription || null,
        content: item.bodyTextExcerpt || null,
        seoTitle: item.seoTitle || item.title || title,
        seoDescription: item.seoDescription || null,
        status: 'published',
        publishedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cmsPages.slug,
        set: {
          title,
          summary: item.seoDescription || null,
          content: item.bodyTextExcerpt || null,
          seoTitle: item.seoTitle || item.title || title,
          seoDescription: item.seoDescription || null,
          status: 'published',
          updatedAt: new Date(),
        },
      });
  }

  for (const item of articlesSnapshot) {
    const url = new URL(item.url);
    const slug = pageSlugFromPath(url.pathname);
    const title = (item.heading || item.title || toTitleCaseFromSlug(slug)).trim();

    await db!
      .insert(editorialContentEntries)
      .values({
        contentType: 'blog',
        title,
        slug,
        summary: item.seoDescription || null,
        locale: 'en-US',
        status: 'published',
        seoTitle: item.seoTitle || item.title || title,
        seoDescription: item.seoDescription || null,
        publishedAt: new Date(),
        payload: {
          lead: item.bodyTextExcerpt || item.seoDescription || '',
          topic: 'Stepper',
          industry: 'Factory Automation',
          authorId: 'site-editorial-team',
          readMinutes: 6,
          viewCount: 0,
          coverAlt: title,
          relatedProductSlugs: [],
          relatedPostSlugs: [],
          sections: [
            {
              id: 'legacy-import',
              title,
              blocks: [
                {
                  type: 'paragraph',
                  text: item.bodyTextExcerpt || item.seoDescription || '',
                },
              ],
            },
          ],
        },
      })
      .onConflictDoUpdate({
        target: [editorialContentEntries.contentType, editorialContentEntries.slug, editorialContentEntries.locale],
        set: {
          title,
          summary: item.seoDescription || null,
          seoTitle: item.seoTitle || item.title || title,
          seoDescription: item.seoDescription || null,
          status: 'published',
          payload: {
            lead: item.bodyTextExcerpt || item.seoDescription || '',
            topic: 'Stepper',
            industry: 'Factory Automation',
            authorId: 'site-editorial-team',
            readMinutes: 6,
            viewCount: 0,
            coverAlt: title,
            relatedProductSlugs: [],
            relatedPostSlugs: [],
            sections: [
              {
                id: 'legacy-import',
                title,
                blocks: [
                  {
                    type: 'paragraph',
                    text: item.bodyTextExcerpt || item.seoDescription || '',
                  },
                ],
              },
            ],
          },
          updatedAt: new Date(),
        },
      });
  }

  await db!
    .insert(contentBlocks)
    .values([
      {
        placement: 'home.legacy-import',
        blockKey: 'banner-images',
        title: 'Legacy homepage banners',
        subtitle: 'Imported from vexmotor.com',
        content: {
          images: bannerSnapshot.images || [],
        },
        status: 'active',
        sortOrder: 1,
      },
      {
        placement: 'footer.legacy-import',
        blockKey: 'footer-content',
        title: 'Legacy footer content',
        subtitle: 'Imported from vexmotor.com',
        content: {
          text: footerSnapshot.text || '',
          html: footerSnapshot.html || '',
          links: footerSnapshot.links || [],
        },
        status: 'active',
        sortOrder: 1,
      },
    ])
    .onConflictDoUpdate({
      target: [contentBlocks.placement, contentBlocks.blockKey],
      set: {
        title: 'Legacy imported content',
        subtitle: 'Imported from vexmotor.com',
        content: {
          bannerImages: bannerSnapshot.images || [],
          footerText: footerSnapshot.text || '',
          footerHtml: footerSnapshot.html || '',
          footerLinks: footerSnapshot.links || [],
        },
        status: 'active',
        updatedAt: new Date(),
      },
    });

  console.log(
    JSON.stringify(
      {
        inputDir,
        importedProducts,
        importedCategories: categoryBySlug.size,
        importedPages: pagesSnapshot.length,
        importedArticles: articlesSnapshot.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error('VexMotor import failed:', error);
  process.exitCode = 1;
});

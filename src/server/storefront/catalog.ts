import { and, asc, count, desc, eq, ilike, or, sql as drizzleSql } from 'drizzle-orm';

import { db } from '@/server/db';
import {
  attachments,
  brands,
  categories,
  productCategories,
  productFeatures,
  productImages,
  products,
  productVariants,
} from '@/server/db/schema';

import { getSeedCategories, getSeedHomeData, getSeedProductBySlug, getSeedProductsResult } from './seed';
import type { HomeData, ProductListResult, StorefrontCategory, StorefrontImage, StorefrontProductCard, StorefrontProductDetail } from './types';

function asMoney(amount: string | number | null | undefined, currencyCode = 'USD') {
  const numeric = Number(amount ?? 0);
  return {
    currency: currencyCode,
    amount: numeric,
    formatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(numeric),
  };
}

function toImage(row: { id: string; url: string; alt: string; width: number | null; height: number | null }): StorefrontImage {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    width: row.width,
    height: row.height,
  };
}

export async function getHomeData(): Promise<HomeData> {
  if (!db) {
    return getSeedHomeData();
  }

  try {
    const [dbCategories, dbProducts] = await Promise.all([
      db.select().from(categories).where(eq(categories.status, 'active')).orderBy(asc(categories.sortOrder)).limit(4),
      db.select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        shortDescription: products.shortDescription,
        purchaseMode: products.purchaseMode,
        stockQuantity: products.stockQuantity,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        currencyCode: products.currencyCode,
        brandId: products.brandId,
        brandName: brands.name,
        brandSlug: brands.slug,
      })
        .from(products)
        .leftJoin(brands, eq(products.brandId, brands.id))
        .where(and(eq(products.status, 'active'), eq(products.featured, true)))
        .orderBy(desc(products.publishedAt), desc(products.createdAt))
        .limit(6),
    ]);

    if (!dbProducts.length) {
      return getSeedHomeData();
    }

    return {
      ...getSeedHomeData(),
      featuredCategories: dbCategories.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        parentId: item.parentId,
      })),
      hotSale: dbProducts.slice(0, 3).map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        shortDescription: item.shortDescription,
        price: asMoney(item.price, item.currencyCode),
        compareAtPrice: item.compareAtPrice ? asMoney(item.compareAtPrice, item.currencyCode) : null,
        purchaseMode: item.purchaseMode,
        inStock: item.stockQuantity > 0,
        brand: item.brandId && item.brandName && item.brandSlug ? { id: item.brandId, name: item.brandName, slug: item.brandSlug } : null,
      })),
      newRelease: dbProducts.slice(0, 3).map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        shortDescription: item.shortDescription,
        price: asMoney(item.price, item.currencyCode),
        compareAtPrice: item.compareAtPrice ? asMoney(item.compareAtPrice, item.currencyCode) : null,
        purchaseMode: item.purchaseMode,
        inStock: item.stockQuantity > 0,
        brand: item.brandId && item.brandName && item.brandSlug ? { id: item.brandId, name: item.brandName, slug: item.brandSlug } : null,
      })),
    };
  } catch {
    return getSeedHomeData();
  }
}

export async function getNavigationData() {
  const items = await getCategories();
  return {
    topLinks: [
      { label: 'Products', href: '/products' },
      { label: 'Certification', href: '/certification' },
      { label: 'About Us', href: '/about' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
    categories: items.slice(0, 6),
  };
}

export async function getCategories(): Promise<StorefrontCategory[]> {
  if (!db) {
    return getSeedCategories();
  }

  try {
    const rows = await db.select().from(categories).where(eq(categories.status, 'active')).orderBy(asc(categories.sortOrder), asc(categories.name));
    if (!rows.length) {
      return getSeedCategories();
    }

    return rows.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      parentId: item.parentId,
      image: item.imageUrl ? { id: `${item.id}-img`, url: item.imageUrl, alt: item.name } : null,
    }));
  } catch {
    return getSeedCategories();
  }
}

export async function getProductList(input: {
  keyword?: string;
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<ProductListResult> {
  if (!db) {
    return getSeedProductsResult(input);
  }

  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 12;
  const offset = (page - 1) * pageSize;

  try {
    let categoryId: string | null = null;
    if (input.categorySlug) {
      const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, input.categorySlug)).limit(1);
      if (!category) {
        return {
          items: [],
          meta: { page, pageSize, total: 0, totalPages: 1 },
          facets: [],
        };
      }
      categoryId = category.id;
    }

    const filters = [eq(products.status, 'active')];
    if (input.keyword) {
      filters.push(
        or(
          ilike(products.name, `%${input.keyword}%`),
          ilike(products.sku, `%${input.keyword}%`),
          ilike(products.shortDescription, `%${input.keyword}%`),
        )!,
      );
    }

    const baseWhere = and(...filters);

    const rows = categoryId
      ? await db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            sku: products.sku,
            shortDescription: products.shortDescription,
            purchaseMode: products.purchaseMode,
            stockQuantity: products.stockQuantity,
            price: products.price,
            compareAtPrice: products.compareAtPrice,
            currencyCode: products.currencyCode,
            brandId: brands.id,
            brandName: brands.name,
            brandSlug: brands.slug,
          })
          .from(products)
          .innerJoin(productCategories, eq(productCategories.productId, products.id))
          .leftJoin(brands, eq(products.brandId, brands.id))
          .where(and(baseWhere, eq(productCategories.categoryId, categoryId)))
          .orderBy(desc(products.featured), desc(products.publishedAt), asc(products.name))
          .limit(pageSize)
          .offset(offset)
      : await db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            sku: products.sku,
            shortDescription: products.shortDescription,
            purchaseMode: products.purchaseMode,
            stockQuantity: products.stockQuantity,
            price: products.price,
            compareAtPrice: products.compareAtPrice,
            currencyCode: products.currencyCode,
            brandId: brands.id,
            brandName: brands.name,
            brandSlug: brands.slug,
          })
          .from(products)
          .leftJoin(brands, eq(products.brandId, brands.id))
          .where(baseWhere)
          .orderBy(desc(products.featured), desc(products.publishedAt), asc(products.name))
          .limit(pageSize)
          .offset(offset);

    const countRows = categoryId
      ? await db
          .select({ total: count() })
          .from(products)
          .innerJoin(productCategories, eq(productCategories.productId, products.id))
          .where(and(baseWhere, eq(productCategories.categoryId, categoryId)))
      : await db.select({ total: count() }).from(products).where(baseWhere);

    if (!rows.length && !countRows[0]?.total) {
      return getSeedProductsResult(input);
    }

    return {
      items: rows.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        shortDescription: item.shortDescription,
        price: asMoney(item.price, item.currencyCode),
        compareAtPrice: item.compareAtPrice ? asMoney(item.compareAtPrice, item.currencyCode) : null,
        purchaseMode: item.purchaseMode,
        inStock: item.stockQuantity > 0,
        brand: item.brandId && item.brandName && item.brandSlug ? { id: item.brandId, name: item.brandName, slug: item.brandSlug } : null,
      })),
      meta: {
        page,
        pageSize,
        total: Number(countRows[0]?.total ?? 0),
        totalPages: Math.max(1, Math.ceil(Number(countRows[0]?.total ?? 0) / pageSize)),
      },
      facets: [
        {
          key: 'purchaseMode',
          label: 'Purchase Mode',
          options: [
            { label: 'Direct Buy', value: 'buy', count: rows.filter((item) => item.purchaseMode === 'buy').length },
            { label: 'Inquiry', value: 'inquiry', count: rows.filter((item) => item.purchaseMode === 'inquiry').length },
          ],
        },
      ],
    };
  } catch {
    return getSeedProductsResult(input);
  }
}

export async function getProductBySlug(slug: string): Promise<StorefrontProductDetail | null> {
  if (!db) {
    return getSeedProductBySlug(slug);
  }

  try {
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        shortDescription: products.shortDescription,
        description: products.description,
        purchaseMode: products.purchaseMode,
        stockQuantity: products.stockQuantity,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        currencyCode: products.currencyCode,
        seoTitle: products.seoTitle,
        seoDescription: products.seoDescription,
        brandId: brands.id,
        brandName: brands.name,
        brandSlug: brands.slug,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(eq(products.slug, slug), eq(products.status, 'active')))
      .limit(1);

    if (!product) {
      return getSeedProductBySlug(slug);
    }

    const [images, categoryRows, attachmentRows, featureRows, variantRows] = await Promise.all([
      db.select().from(productImages).where(eq(productImages.productId, product.id)).orderBy(asc(productImages.sortOrder)),
      db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          parentId: categories.parentId,
          imageUrl: categories.imageUrl,
        })
        .from(productCategories)
        .innerJoin(categories, eq(categories.id, productCategories.categoryId))
        .where(eq(productCategories.productId, product.id)),
      db.select().from(attachments).where(eq(attachments.productId, product.id)).orderBy(asc(attachments.sortOrder)),
      db.select().from(productFeatures).where(eq(productFeatures.productId, product.id)).orderBy(asc(productFeatures.sortOrder)),
      db.select().from(productVariants).where(eq(productVariants.productId, product.id)).orderBy(asc(productVariants.createdAt)),
    ]);

    const related = await getRelatedProducts(slug, categoryRows[0]?.slug ?? null, product.id);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      shortDescription: product.shortDescription,
      description: product.description ?? '',
      coverImage: images[0] ? toImage(images[0]) : null,
      gallery: images.map(toImage),
      price: asMoney(product.price, product.currencyCode),
      compareAtPrice: product.compareAtPrice ? asMoney(product.compareAtPrice, product.currencyCode) : null,
      purchaseMode: product.purchaseMode,
      inStock: product.stockQuantity > 0,
      stockQuantity: product.stockQuantity,
      brand: product.brandId && product.brandName && product.brandSlug ? { id: product.brandId, name: product.brandName, slug: product.brandSlug } : null,
      categories: categoryRows.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        parentId: item.parentId,
        image: item.imageUrl ? { id: `${item.id}-img`, url: item.imageUrl, alt: item.name } : null,
      })),
      attributes: variantRows.flatMap((row) => row.attributes).slice(0, 8),
      attachments: attachmentRows.map((item) => ({
        id: item.id,
        name: item.name,
        url: item.url,
        mimeType: item.mimeType,
      })),
      relatedProducts: related,
      seoTitle: product.seoTitle,
      seoDescription: product.seoDescription,
      features: featureRows.map((item) => ({
        key: item.featureKey,
        value: item.featureValue,
        unit: item.unit,
      })),
    };
  } catch {
    return getSeedProductBySlug(slug);
  }
}

export async function getRelatedProducts(slug: string, categorySlug?: string | null, excludeId?: string): Promise<StorefrontProductCard[]> {
  if (!db) {
    const detail = getSeedProductBySlug(slug);
    return detail?.relatedProducts ?? [];
  }

  try {
    let categoryId: string | null = null;
    if (categorySlug) {
      const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).limit(1);
      categoryId = category?.id ?? null;
    }

    const rows = categoryId
      ? await db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            sku: products.sku,
            shortDescription: products.shortDescription,
            purchaseMode: products.purchaseMode,
            stockQuantity: products.stockQuantity,
            price: products.price,
            compareAtPrice: products.compareAtPrice,
            currencyCode: products.currencyCode,
            brandId: brands.id,
            brandName: brands.name,
            brandSlug: brands.slug,
          })
          .from(products)
          .innerJoin(productCategories, eq(productCategories.productId, products.id))
          .leftJoin(brands, eq(products.brandId, brands.id))
          .where(and(eq(products.status, 'active'), eq(productCategories.categoryId, categoryId), excludeId ? drizzleSql`${products.id} <> ${excludeId}` : undefined))
          .orderBy(desc(products.featured), desc(products.publishedAt))
          .limit(4)
      : await db
          .select({
            id: products.id,
            name: products.name,
            slug: products.slug,
            sku: products.sku,
            shortDescription: products.shortDescription,
            purchaseMode: products.purchaseMode,
            stockQuantity: products.stockQuantity,
            price: products.price,
            compareAtPrice: products.compareAtPrice,
            currencyCode: products.currencyCode,
            brandId: brands.id,
            brandName: brands.name,
            brandSlug: brands.slug,
          })
          .from(products)
          .leftJoin(brands, eq(products.brandId, brands.id))
          .where(and(eq(products.status, 'active'), excludeId ? drizzleSql`${products.id} <> ${excludeId}` : undefined))
          .orderBy(desc(products.featured), desc(products.publishedAt))
          .limit(4);

    return rows.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      shortDescription: item.shortDescription,
      price: asMoney(item.price, item.currencyCode),
      compareAtPrice: item.compareAtPrice ? asMoney(item.compareAtPrice, item.currencyCode) : null,
      purchaseMode: item.purchaseMode,
      inStock: item.stockQuantity > 0,
      brand: item.brandId && item.brandName && item.brandSlug ? { id: item.brandId, name: item.brandName, slug: item.brandSlug } : null,
    }));
  } catch {
    const detail = getSeedProductBySlug(slug);
    return detail?.relatedProducts ?? [];
  }
}

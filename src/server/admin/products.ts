import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm';

import { db } from '@/server/db';
import { attachments, brands, categories, productFeatures, productImages, products } from '@/server/db/schema';

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string | null;
  description: string | null;
  purchaseMode: 'buy' | 'inquiry';
  status: 'draft' | 'active' | 'inactive' | 'archived';
  stockQuantity: number;
  price: string;
  compareAtPrice: string | null;
  currencyCode: string;
  featured: boolean;
  brandId: string | null;
  defaultCategoryId: string | null;
  brandName: string | null;
  categoryName: string | null;
};

export type AdminProductDetail = AdminProductRow & {
  seoTitle: string | null;
  seoDescription: string | null;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    isPrimary: boolean;
  }>;
  features: Array<{
    id: string;
    featureKey: string;
    featureValue: string;
    unit: string | null;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    mimeType: string;
  }>;
};

export async function getAdminProducts(search = '') {
  if (!db) {
    return { items: [] as AdminProductRow[], total: 0 };
  }

  const filters = search
    ? [
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.sku, `%${search}%`),
          ilike(products.slug, `%${search}%`),
        )!,
      ]
    : [];

  const where = filters.length ? and(...filters) : undefined;

  const [items, totals] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        shortDescription: products.shortDescription,
        description: products.description,
        purchaseMode: products.purchaseMode,
        status: products.status,
        stockQuantity: products.stockQuantity,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        currencyCode: products.currencyCode,
        featured: products.featured,
        brandId: products.brandId,
        defaultCategoryId: products.defaultCategoryId,
        brandName: brands.name,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.defaultCategoryId, categories.id))
      .where(where)
      .orderBy(desc(products.updatedAt), asc(products.name)),
    db.select({ total: count() }).from(products).where(where),
  ]);

  return {
    items,
    total: Number(totals[0]?.total ?? 0),
  };
}

export async function getAdminProductOptions() {
  if (!db) {
    return {
      brands: [] as Array<{ label: string; value: string }>,
      categories: [] as Array<{ label: string; value: string }>,
    };
  }

  const [brandRows, categoryRows] = await Promise.all([
    db.select({ value: brands.id, label: brands.name }).from(brands).orderBy(asc(brands.name)),
    db.select({ value: categories.id, label: categories.name }).from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)),
  ]);

  return {
    brands: brandRows,
    categories: categoryRows,
  };
}

export async function getAdminProductDetail(id: string): Promise<AdminProductDetail | null> {
  if (!db) return null;

  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      sku: products.sku,
      shortDescription: products.shortDescription,
      description: products.description,
      purchaseMode: products.purchaseMode,
      status: products.status,
      stockQuantity: products.stockQuantity,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      currencyCode: products.currencyCode,
      featured: products.featured,
      brandId: products.brandId,
      defaultCategoryId: products.defaultCategoryId,
      brandName: brands.name,
      categoryName: categories.name,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.defaultCategoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);

  if (!product) {
    return null;
  }

  const [imageRows, featureRows, attachmentRows] = await Promise.all([
    db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder)),
    db.select().from(productFeatures).where(eq(productFeatures.productId, id)).orderBy(asc(productFeatures.sortOrder)),
    db.select().from(attachments).where(eq(attachments.productId, id)).orderBy(asc(attachments.sortOrder)),
  ]);

  return {
    ...product,
    images: imageRows.map((item) => ({
      id: item.id,
      url: item.url,
      alt: item.alt,
      width: item.width,
      height: item.height,
      isPrimary: item.isPrimary,
    })),
    features: featureRows.map((item) => ({
      id: item.id,
      featureKey: item.featureKey,
      featureValue: item.featureValue,
      unit: item.unit,
    })),
    attachments: attachmentRows.map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      mimeType: item.mimeType,
    })),
  };
}
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminProducts } from '@/server/admin/products';
import { db } from '@/server/db';
import { attachments, productFeatures, productImages, products } from '@/server/db/schema';

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  width: z.coerce.number().int().positive().optional().nullable(),
  height: z.coerce.number().int().positive().optional().nullable(),
  isPrimary: z.boolean().default(false),
});

const featureSchema = z.object({
  featureKey: z.string().min(1),
  featureValue: z.string().min(1),
  unit: z.string().optional().nullable(),
});

const attachmentSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  mimeType: z.string().min(1),
});

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  purchaseMode: z.enum(['buy', 'inquiry']),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).default('draft'),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  currencyCode: z.string().length(3).default('USD'),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  brandId: z.string().uuid().optional().nullable(),
  defaultCategoryId: z.string().uuid().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z.array(imageSchema).default([]),
  features: z.array(featureSchema).default([]),
  attachments: z.array(attachmentSchema).default([]),
});

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') ?? '';
  const result = await getAdminProducts(search);

  return NextResponse.json({ items: result.items, meta: { total: result.total } });
}

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ code: 'DB_UNAVAILABLE', message: 'Database is not configured' }, { status: 503 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const created = await db.transaction(async (tx) => {
    const [product] = await tx
      .insert(products)
      .values({
        name: parsed.data.name,
        slug: parsed.data.slug,
        sku: parsed.data.sku,
        shortDescription: parsed.data.shortDescription ?? null,
        description: parsed.data.description ?? null,
        purchaseMode: parsed.data.purchaseMode,
        status: parsed.data.status,
        price: parsed.data.price.toFixed(2),
        compareAtPrice: parsed.data.compareAtPrice == null ? null : parsed.data.compareAtPrice.toFixed(2),
        currencyCode: parsed.data.currencyCode.toUpperCase(),
        stockQuantity: parsed.data.stockQuantity,
        featured: parsed.data.featured,
        brandId: parsed.data.brandId ?? null,
        defaultCategoryId: parsed.data.defaultCategoryId ?? null,
        seoTitle: parsed.data.seoTitle ?? null,
        seoDescription: parsed.data.seoDescription ?? null,
      })
      .returning();

    if (!product) {
      return null;
    }

    if (parsed.data.images.length) {
      await tx.insert(productImages).values(
        parsed.data.images.map((item, index) => ({
          productId: product.id,
          url: item.url,
          alt: item.alt,
          width: item.width ?? null,
          height: item.height ?? null,
          isPrimary: item.isPrimary,
          sortOrder: index + 1,
        })),
      );
    }

    if (parsed.data.features.length) {
      await tx.insert(productFeatures).values(
        parsed.data.features.map((item, index) => ({
          productId: product.id,
          featureKey: item.featureKey,
          featureValue: item.featureValue,
          unit: item.unit ?? null,
          sortOrder: index + 1,
        })),
      );
    }

    if (parsed.data.attachments.length) {
      await tx.insert(attachments).values(
        parsed.data.attachments.map((item, index) => ({
          productId: product.id,
          name: item.name,
          url: item.url,
          mimeType: item.mimeType,
          sortOrder: index + 1,
        })),
      );
    }

    return product;
  });

  return NextResponse.json(created, { status: 201 });
}

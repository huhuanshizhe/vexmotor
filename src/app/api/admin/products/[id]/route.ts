import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminProductDetail } from '@/server/admin/products';
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

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  shortDescription: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  purchaseMode: z.enum(['buy', 'inquiry']).optional(),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).optional(),
  price: z.coerce.number().min(0).optional(),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  currencyCode: z.string().length(3).optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  brandId: z.string().uuid().nullable().optional(),
  defaultCategoryId: z.string().uuid().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  images: z.array(imageSchema).optional(),
  features: z.array(featureSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProductDetail(id);
  if (!product) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!db) {
    return NextResponse.json({ code: 'DB_UNAVAILABLE', message: 'Database is not configured' }, { status: 503 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getAdminProductDetail(id);
  if (!existing) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
  }

  const updated = await db.transaction(async (tx) => {
    const updates = {
      ...parsed.data,
      price: parsed.data.price == null ? undefined : parsed.data.price.toFixed(2),
      compareAtPrice: parsed.data.compareAtPrice == null ? parsed.data.compareAtPrice : parsed.data.compareAtPrice.toFixed(2),
      currencyCode: parsed.data.currencyCode?.toUpperCase(),
      updatedAt: new Date(),
    };

    const [product] = await tx.update(products).set(updates).where(eq(products.id, id)).returning();

    if (!product) {
      return null;
    }

    if (parsed.data.images) {
      await tx.delete(productImages).where(eq(productImages.productId, id));
      if (parsed.data.images.length) {
        await tx.insert(productImages).values(
          parsed.data.images.map((item, index) => ({
            productId: id,
            url: item.url,
            alt: item.alt,
            width: item.width ?? null,
            height: item.height ?? null,
            isPrimary: item.isPrimary,
            sortOrder: index + 1,
          })),
        );
      }
    }

    if (parsed.data.features) {
      await tx.delete(productFeatures).where(eq(productFeatures.productId, id));
      if (parsed.data.features.length) {
        await tx.insert(productFeatures).values(
          parsed.data.features.map((item, index) => ({
            productId: id,
            featureKey: item.featureKey,
            featureValue: item.featureValue,
            unit: item.unit ?? null,
            sortOrder: index + 1,
          })),
        );
      }
    }

    if (parsed.data.attachments) {
      await tx.delete(attachments).where(eq(attachments.productId, id));
      if (parsed.data.attachments.length) {
        await tx.insert(attachments).values(
          parsed.data.attachments.map((item, index) => ({
            productId: id,
            name: item.name,
            url: item.url,
            mimeType: item.mimeType,
            sortOrder: index + 1,
          })),
        );
      }
    }

    return product;
  });

  if (!updated) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!db) {
    return NextResponse.json({ code: 'DB_UNAVAILABLE', message: 'Database is not configured' }, { status: 503 });
  }

  const { id } = await params;
  const [deleted] = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });

  if (!deleted) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}

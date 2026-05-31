import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { deleteAdminProduct, getAdminProductDetail, updateAdminProduct } from '@/server/admin/products';

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

  const updated = await updateAdminProduct(id, parsed.data);

  if (!updated) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteAdminProduct(id);

  if (!deleted) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Product not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createAdminProduct, getAdminProducts } from '@/server/admin/products';

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  width: z.coerce.number().int().positive().optional().nullable().transform((value) => value ?? null),
  height: z.coerce.number().int().positive().optional().nullable().transform((value) => value ?? null),
  isPrimary: z.boolean().default(false),
});

const featureSchema = z.object({
  featureKey: z.string().min(1),
  featureValue: z.string().min(1),
  unit: z.string().optional().nullable().transform((value) => value ?? null),
});

const attachmentSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  mimeType: z.string().min(1),
});

const compatibleProductSchema = z.object({
  relatedProductId: z.string().min(1),
  relationType: z.enum(['drivers', 'mechanical-integration', 'power-control', 'custom']).default('custom'),
  relationLabel: z.string().optional().nullable().transform((value) => value ?? null),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  shortDescription: z.string().optional().nullable().transform((value) => value ?? null),
  description: z.string().optional().nullable().transform((value) => value ?? null),
  purchaseMode: z.enum(['buy', 'inquiry']),
  status: z.enum(['draft', 'active', 'inactive', 'archived']).default('draft'),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable().transform((value) => value ?? null),
  currencyCode: z.string().length(3).default('USD'),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  brandId: z.string().uuid().optional().nullable().transform((value) => value ?? null),
  defaultCategoryId: z.string().uuid().optional().nullable().transform((value) => value ?? null),
  seoTitle: z.string().optional().nullable().transform((value) => value ?? null),
  seoDescription: z.string().optional().nullable().transform((value) => value ?? null),
  images: z.array(imageSchema).default([]),
  features: z.array(featureSchema).default([]),
  attachments: z.array(attachmentSchema).default([]),
  compatibleProducts: z.array(compatibleProductSchema).default([]),
});

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get('search') ?? '';
  const result = await getAdminProducts(search);

  return NextResponse.json({ items: result.items, meta: { total: result.total } });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const created = await createAdminProduct(parsed.data);

  if (!created) {
    return NextResponse.json({ code: 'CREATE_FAILED', message: 'Unable to create product' }, { status: 500 });
  }

  return NextResponse.json(created, { status: 201 });
}

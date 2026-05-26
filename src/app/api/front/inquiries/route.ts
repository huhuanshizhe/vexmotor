import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUserId } from '@/server/auth/session';
import { db } from '@/server/db';
import { inquiries } from '@/server/db/schema';
import { getInquiriesByUser } from '@/server/storefront/account';

const inquirySchema = z.object({
  productId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!db) {
    return NextResponse.json({ code: 'DB_UNAVAILABLE', message: 'Database is not configured' }, { status: 503 });
  }

  const body = await request.json();
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'Invalid inquiry payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const userId = await getCurrentUserId();

  const [created] = await db
    .insert(inquiries)
    .values({
      productId: parsed.data.productId,
      userId,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      company: parsed.data.company ?? null,
      country: parsed.data.country ?? null,
      message: parsed.data.message,
      status: 'new',
      sourcePageUrl: request.headers.get('referer') ?? null,
    })
    .returning();

  return NextResponse.json(
    created,
    { status: 201 },
  );
}

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  return NextResponse.json(await getInquiriesByUser(userId));
}

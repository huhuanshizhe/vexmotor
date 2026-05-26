import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUserId } from '@/server/auth/session';
import { db } from '@/server/db';
import { inquiries } from '@/server/db/schema';
import { getAdminInquiryDetail } from '@/server/admin/inquiries';

const patchSchema = z.object({
  status: z.enum(['new', 'contacted', 'quoted', 'closed']).optional(),
  internalNote: z.string().nullable().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getAdminInquiryDetail(id);
  if (!inquiry) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Inquiry not found' }, { status: 404 });
  }

  return NextResponse.json(inquiry);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!db) {
    return NextResponse.json({ code: 'DB_UNAVAILABLE', message: 'Database is not configured' }, { status: 503 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const currentUserId = await getCurrentUserId();
  const [updated] = await db
    .update(inquiries)
    .set({
      status: parsed.data.status,
      internalNote: parsed.data.internalNote,
      handledAt: parsed.data.status && parsed.data.status !== 'new' ? new Date() : null,
      handledBy: currentUserId,
      updatedAt: new Date(),
    })
    .where(eq(inquiries.id, id))
    .returning({ id: inquiries.id });

  if (!updated) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Inquiry not found' }, { status: 404 });
  }

  return NextResponse.json(await getAdminInquiryDetail(id));
}

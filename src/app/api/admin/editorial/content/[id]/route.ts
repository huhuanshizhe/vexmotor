import { NextRequest, NextResponse } from 'next/server';

import {
  adminEditorialBlogEntryPatchSchema,
  deleteAdminEditorialBlogEntry,
  findAdminEditorialBlogEntryBySlug,
  getAdminEditorialBlogEntry,
  updateAdminEditorialBlogEntry,
} from '@/server/admin/editorial-content';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAdminEditorialBlogEntry(id);

  if (!item) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Editorial entry not found' }, { status: 404 });
  }

  return NextResponse.json(item);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const body = await request.json();
  const parsed = adminEditorialBlogEntryPatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const current = await getAdminEditorialBlogEntry(id);
  if (!current) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Editorial entry not found' }, { status: 404 });
  }

  const nextSlug = parsed.data.slug ?? current.slug;
  const nextLocale = parsed.data.locale ?? current.locale;
  const existing = await findAdminEditorialBlogEntryBySlug(nextSlug, nextLocale, id);
  if (existing) {
    return NextResponse.json({ code: 'SLUG_CONFLICT', message: 'Slug already exists for this locale' }, { status: 409 });
  }

  const updated = await updateAdminEditorialBlogEntry(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Editorial entry not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteAdminEditorialBlogEntry(id);

  if (!deleted) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Editorial entry not found' }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
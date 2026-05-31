import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { importSeededBlogPosts } from '@/server/admin/editorial-content';

const importRequestSchema = z.object({
  dryRun: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = importRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const result = await importSeededBlogPosts({ dryRun: parsed.data.dryRun });
  return NextResponse.json(result, { status: 200 });
}
import { NextResponse } from 'next/server';

import { getCurrentUserId } from '@/server/auth/session';
import { getProfile } from '@/server/storefront/account';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const profile = await getProfile(userId);
  if (!profile) {
    return NextResponse.json({ code: 'NOT_FOUND', message: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

import { NextResponse } from 'next/server';

import { getCurrentUserId } from '@/server/auth/session';
import { getOrdersByUser } from '@/server/storefront/account';

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  return NextResponse.json(await getOrdersByUser(userId));
}

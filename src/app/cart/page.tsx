import { cookies } from 'next/headers';

import { getCurrentUserId } from '@/server/auth/session';
import { getActiveCartDetail } from '@/server/storefront/cart';

import { CartClient } from './cart-client';

export default async function CartPage() {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();
  const cart = await getActiveCartDetail({ userId, anonymousToken: cookieStore.get('cart_token')?.value ?? null });

  return <CartClient initialCart={cart} />;
}

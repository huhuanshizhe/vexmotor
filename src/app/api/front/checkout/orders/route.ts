import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUserId } from '@/server/auth/session';
import { createOrderFromCart, getOrCreateCart } from '@/server/storefront/cart';

const orderSchema = z.object({
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  shippingMethod: z.string().min(1),
  paymentMethod: z.string().min(1),
  customerNote: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ code: 'UNAUTHORIZED', message: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid checkout payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const cookieStore = await cookies();
  const cart = await getOrCreateCart({ userId, anonymousToken: cookieStore.get('cart_token')?.value ?? null });
  if (!cart) {
    return NextResponse.json({ code: 'CART_UNAVAILABLE', message: 'Cart not found' }, { status: 400 });
  }

  const order = await createOrderFromCart({
    userId,
    cartId: cart.id,
    shippingAddressId: parsed.data.shippingAddressId,
    billingAddressId: parsed.data.billingAddressId,
    shippingMethod: parsed.data.shippingMethod,
    paymentMethod: parsed.data.paymentMethod,
    customerNote: parsed.data.customerNote,
  });

  if (!order) {
    return NextResponse.json({ code: 'ORDER_CREATE_FAILED', message: 'Unable to create order' }, { status: 400 });
  }

  return NextResponse.json(order, { status: 201 });
}

import { randomUUID } from 'node:crypto';

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentUserId } from '@/server/auth/session';
import { addCartItem, getCartDetail, getOrCreateCart, updateCartCoupon } from '@/server/storefront/cart';

const addSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  variantId: z.string().optional().nullable(),
});

const couponSchema = z.object({
  couponCode: z.string().trim().min(1).max(40).optional().nullable(),
});

async function getCartContext() {
  const cookieStore = await cookies();
  const userId = await getCurrentUserId();
  let anonymousToken = cookieStore.get('cart_token')?.value ?? null;

  if (!userId && !anonymousToken) {
    anonymousToken = randomUUID();
  }

  const cart = await getOrCreateCart({ userId, anonymousToken });
  return { cart, anonymousToken };
}

export async function GET() {
  const { cart, anonymousToken } = await getCartContext();
  if (!cart) {
    return NextResponse.json({ code: 'CART_UNAVAILABLE', message: 'Cart could not be initialized' }, { status: 500 });
  }

  const detail = await getCartDetail(cart.id);
  const response = NextResponse.json(detail);
  if (anonymousToken && !cart.userId) {
    response.cookies.set('cart_token', anonymousToken, { httpOnly: true, sameSite: 'lax', path: '/' });
  }
  return response;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid cart payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { cart, anonymousToken } = await getCartContext();
  if (!cart) {
    return NextResponse.json({ code: 'CART_UNAVAILABLE', message: 'Cart could not be initialized' }, { status: 500 });
  }

  const detail = await addCartItem({
    cartId: cart.id,
    productId: parsed.data.productId,
    quantity: parsed.data.quantity,
  });

  if (!detail) {
    return NextResponse.json({ code: 'PRODUCT_NOT_AVAILABLE', message: 'Product cannot be added to cart' }, { status: 400 });
  }

  const response = NextResponse.json(detail);
  if (anonymousToken && !cart.userId) {
    response.cookies.set('cart_token', anonymousToken, { httpOnly: true, sameSite: 'lax', path: '/' });
  }
  return response;
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ code: 'VALIDATION_ERROR', message: 'Invalid coupon payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const { cart, anonymousToken } = await getCartContext();
  if (!cart) {
    return NextResponse.json({ code: 'CART_UNAVAILABLE', message: 'Cart could not be initialized' }, { status: 500 });
  }

  const result = await updateCartCoupon(cart.id, parsed.data.couponCode ?? null);
  if (!result.detail) {
    return NextResponse.json({ code: result.error ?? 'COUPON_UPDATE_FAILED', message: result.message ?? 'Coupon update failed' }, { status: 400 });
  }

  const response = NextResponse.json(result.detail);
  if (anonymousToken && !cart.userId) {
    response.cookies.set('cart_token', anonymousToken, { httpOnly: true, sameSite: 'lax', path: '/' });
  }
  return response;
}

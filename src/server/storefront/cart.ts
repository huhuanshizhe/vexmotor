import { and, eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { addresses, cartItems, carts, orderItems, orders, products } from '@/server/db/schema';

function formatMoney(amount: string | number, currencyCode = 'USD') {
  const numeric = Number(amount);
  return {
    currency: currencyCode,
    amount: numeric,
    formatted: new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(numeric),
  };
}

export async function getOrCreateCart(input: { userId?: string | null; anonymousToken?: string | null }) {
  if (!db) return null;

  const [existing] = input.userId
    ? await db.select().from(carts).where(and(eq(carts.userId, input.userId), eq(carts.status, 'active'))).limit(1)
    : await db.select().from(carts).where(and(eq(carts.anonymousToken, input.anonymousToken ?? ''), eq(carts.status, 'active'))).limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(carts)
    .values({
      userId: input.userId ?? null,
      anonymousToken: input.userId ? null : input.anonymousToken ?? null,
      status: 'active',
      currencyCode: 'USD',
    })
    .returning();

  return created ?? null;
}

export async function getActiveCartDetail(input: { userId?: string | null; anonymousToken?: string | null }) {
  const cart = await getOrCreateCart(input);
  if (!cart) {
    return null;
  }

  return getCartDetail(cart.id);
}

export async function getCartDetail(cartId: string) {
  if (!db) return null;

  const [cart] = await db.select().from(carts).where(eq(carts.id, cartId)).limit(1);
  if (!cart) return null;

  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      unitPrice: cartItems.unitPrice,
      subtotal: cartItems.subtotal,
      productName: products.name,
      slug: products.slug,
      sku: products.sku,
      shortDescription: products.shortDescription,
      purchaseMode: products.purchaseMode,
      stockQuantity: products.stockQuantity,
      currencyCode: products.currencyCode,
    })
    .from(cartItems)
    .innerJoin(products, eq(products.id, cartItems.productId))
    .where(eq(cartItems.cartId, cartId));

  const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
  const shipping = subtotal >= 299 ? 0 : (items.length ? 18 : 0);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return {
    id: cart.id,
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      product: {
        id: item.productId,
        name: item.productName,
        slug: item.slug,
        sku: item.sku,
        shortDescription: item.shortDescription,
        price: formatMoney(item.unitPrice, item.currencyCode),
        compareAtPrice: null,
        purchaseMode: item.purchaseMode,
        inStock: item.stockQuantity > 0,
        brand: null,
      },
      quantity: item.quantity,
      unitPrice: formatMoney(item.unitPrice, item.currencyCode),
      subtotal: formatMoney(item.subtotal, item.currencyCode),
      variantLabel: '',
    })),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: formatMoney(subtotal, cart.currencyCode),
    shipping: formatMoney(shipping, cart.currencyCode),
    tax: formatMoney(tax, cart.currencyCode),
    total: formatMoney(total, cart.currencyCode),
  };
}

export async function addCartItem(input: { cartId: string; productId: string; quantity: number }) {
  if (!db) return null;

  const [product] = await db.select().from(products).where(eq(products.id, input.productId)).limit(1);
  if (!product || product.purchaseMode !== 'buy') {
    return null;
  }

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, input.cartId), eq(cartItems.productId, input.productId)))
    .limit(1);

  const unitPrice = Number(product.price);
  if (existing) {
    await db
      .update(cartItems)
      .set({
        quantity: existing.quantity + input.quantity,
        subtotal: ((existing.quantity + input.quantity) * unitPrice).toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId: input.cartId,
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: unitPrice.toFixed(2),
      subtotal: (input.quantity * unitPrice).toFixed(2),
    });
  }

  return getCartDetail(input.cartId);
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (!db) return null;

  const [existing] = await db.select().from(cartItems).where(eq(cartItems.id, itemId)).limit(1);
  if (!existing) {
    return null;
  }

  await db
    .update(cartItems)
    .set({
      quantity,
      subtotal: (Number(existing.unitPrice) * quantity).toFixed(2),
      updatedAt: new Date(),
    })
    .where(eq(cartItems.id, itemId));

  return getCartDetail(existing.cartId);
}

export async function deleteCartItem(itemId: string) {
  if (!db) return null;

  const [deleted] = await db.delete(cartItems).where(eq(cartItems.id, itemId)).returning();
  if (!deleted) {
    return null;
  }

  return getCartDetail(deleted.cartId);
}

export async function createOrderFromCart(input: {
  userId: string;
  cartId: string;
  shippingAddressId: string;
  billingAddressId: string;
  shippingMethod: string;
  paymentMethod: string;
  customerNote?: string;
}) {
  if (!db) return null;

  const [shippingAddress, billingAddress, cart] = await Promise.all([
    db.select().from(addresses).where(eq(addresses.id, input.shippingAddressId)).limit(1),
    db.select().from(addresses).where(eq(addresses.id, input.billingAddressId)).limit(1),
    db.select().from(carts).where(eq(carts.id, input.cartId)).limit(1),
  ]);

  const ship = shippingAddress[0];
  const bill = billingAddress[0];
  const currentCart = cart[0];
  if (!ship || !bill || !currentCart || currentCart.userId !== input.userId) {
    return null;
  }

  const detail = await getCartDetail(input.cartId);
  if (!detail || !detail.items.length) {
    return null;
  }

  const orderNumber = `LC-${Date.now()}`;
  const [createdOrder] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: input.userId,
      cartId: input.cartId,
      status: 'pending',
      currencyCode: currentCart.currencyCode,
      subtotal: detail.subtotal.amount.toFixed(2),
      shippingAmount: detail.shipping.amount.toFixed(2),
      taxAmount: detail.tax.amount.toFixed(2),
      discountAmount: '0.00',
      totalAmount: detail.total.amount.toFixed(2),
      shippingMethod: input.shippingMethod,
      paymentMethod: input.paymentMethod,
      customerNote: input.customerNote ?? null,
      shippingAddressSnapshot: ship,
      billingAddressSnapshot: bill,
      placedAt: new Date(),
    })
    .returning();

  if (!createdOrder) {
    return null;
  }

  await db.insert(orderItems).values(
    detail.items.map((item) => ({
      orderId: createdOrder.id,
      productId: item.productId,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      unitPrice: item.unitPrice.amount.toFixed(2),
      subtotal: item.subtotal.amount.toFixed(2),
    })),
  );

  await db.update(carts).set({ status: 'converted', updatedAt: new Date() }).where(eq(carts.id, input.cartId));

  return createdOrder;
}

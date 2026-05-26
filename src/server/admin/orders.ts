import { desc, eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { orderItems, orders, users } from '@/server/db/schema';

export async function getAdminOrders() {
  if (!db) return [];

  return db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentMethod: orders.paymentMethod,
      shippingMethod: orders.shippingMethod,
      placedAt: orders.placedAt,
      createdAt: orders.createdAt,
      customerEmail: users.email,
      customerName: users.firstName,
      customerLastName: users.lastName,
    })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .orderBy(desc(orders.createdAt));
}

export async function getAdminOrderDetail(orderNumber: string) {
  if (!db) return null;

  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      subtotal: orders.subtotal,
      shippingAmount: orders.shippingAmount,
      taxAmount: orders.taxAmount,
      totalAmount: orders.totalAmount,
      paymentMethod: orders.paymentMethod,
      shippingMethod: orders.shippingMethod,
      customerNote: orders.customerNote,
      shippingAddressSnapshot: orders.shippingAddressSnapshot,
      billingAddressSnapshot: orders.billingAddressSnapshot,
      placedAt: orders.placedAt,
      createdAt: orders.createdAt,
      customerEmail: users.email,
      customerName: users.firstName,
      customerLastName: users.lastName,
    })
    .from(orders)
    .innerJoin(users, eq(users.id, orders.userId))
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) {
    return null;
  }

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).orderBy(desc(orderItems.createdAt));
  return { ...order, items };
}

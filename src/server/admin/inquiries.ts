import { desc, eq } from 'drizzle-orm';

import { db } from '@/server/db';
import { inquiries, products, users } from '@/server/db/schema';

export async function getAdminInquiries() {
  if (!db) return [];

  return db
    .select({
      id: inquiries.id,
      status: inquiries.status,
      fullName: inquiries.fullName,
      email: inquiries.email,
      company: inquiries.company,
      country: inquiries.country,
      createdAt: inquiries.createdAt,
      handledAt: inquiries.handledAt,
      productName: products.name,
      productSlug: products.slug,
      productSku: products.sku,
    })
    .from(inquiries)
    .innerJoin(products, eq(products.id, inquiries.productId))
    .orderBy(desc(inquiries.createdAt));
}

export async function getAdminInquiryDetail(id: string) {
  if (!db) return null;

  const [inquiry] = await db
    .select({
      id: inquiries.id,
      status: inquiries.status,
      fullName: inquiries.fullName,
      email: inquiries.email,
      phone: inquiries.phone,
      company: inquiries.company,
      country: inquiries.country,
      message: inquiries.message,
      sourcePageUrl: inquiries.sourcePageUrl,
      internalNote: inquiries.internalNote,
      createdAt: inquiries.createdAt,
      handledAt: inquiries.handledAt,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      productSku: products.sku,
      handledByEmail: users.email,
    })
    .from(inquiries)
    .innerJoin(products, eq(products.id, inquiries.productId))
    .leftJoin(users, eq(users.id, inquiries.handledBy))
    .where(eq(inquiries.id, id))
    .limit(1);

  return inquiry ?? null;
}

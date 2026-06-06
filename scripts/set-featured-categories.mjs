/**
 * 设置 18 个推荐类目到首页
 * 更新数据库中的 isFeatured 和 featuredOrder 字段
 */

import { eq } from 'drizzle-orm';
import { db } from '../src/server/db/index.ts';
import { categories } from '../src/server/db/schema.ts';

const featuredCategories = [
  { slug: 'nema-8-stepper-motor', order: 1 },
  { slug: 'nema-8-bipolar', order: 2 },
  { slug: 'nema-11-stepper-motor', order: 3 },
  { slug: 'nema-11-unipolar', order: 4 },
  { slug: 'nema-14-stepper-motor', order: 5 },
  { slug: 'nema-14-bipolar', order: 6 },
  { slug: 'nema-16-stepper-motor', order: 7 },
  { slug: 'nema-17-stepper-motor', order: 8 },
  { slug: 'nema-17-bipolar', order: 9 },
  { slug: 'nema-17-unipolar', order: 10 },
  { slug: 'nema-17-high-torque', order: 11 },
  { slug: 'nema-23-stepper-motor', order: 12 },
  { slug: 'nema-23-bipolar', order: 13 },
  { slug: 'nema-24-stepper-motor', order: 14 },
  { slug: 'nema-34-stepper-motor', order: 15 },
  { slug: 'stepper-motor-driver', order: 16 },
  { slug: 'digital-stepper-driver', order: 17 },
  { slug: 'power-supply', order: 18 },
];

async function main() {
  console.log('🚀 开始设置 18 个推荐类目...\n');

  if (!db) {
    console.error('❌ 数据库连接失败');
    process.exit(1);
  }

  let successCount = 0;
  let notFoundCount = 0;

  for (const { slug, order } of featuredCategories) {
    try {
      const [updated] = await db
        .update(categories)
        .set({
          isFeatured: true,
          featuredOrder: order,
          updatedAt: new Date(),
        })
        .where(eq(categories.slug, slug))
        .returning({ id: categories.id, name: categories.name, slug: categories.slug });

      if (updated) {
        console.log(`✅ #${order} ${updated.name} (${slug})`);
        successCount++;
      } else {
        console.log(`⚠️  #${order} 未找到: ${slug}`);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`❌ #${order} 更新失败 (${slug}):`, error);
    }
  }

  console.log(`\n📊 完成统计:`);
  console.log(`  ✅ 成功: ${successCount}`);
  console.log(`  ⚠️  未找到: ${notFoundCount}`);
  console.log(`  📝 总计: ${featuredCategories.length}`);
  
  process.exit(0);
}

main().catch(console.error);

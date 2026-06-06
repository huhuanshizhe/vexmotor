# 数据库迁移执行指南

## 迁移文件：`drizzle/0001_wealthy_solo.sql`

### 方式一：通过 Neon 控制台执行（推荐）

1. 登录 [Neon Console](https://console.neon.tech)
2. 选择项目 `neondb`
3. 打开 SQL Editor
4. 粘贴以下 SQL 并执行：

```sql
-- 1. 创建枚举类型
DO $$ BEGIN
  CREATE TYPE "public"."product_relation_type" AS ENUM('drivers', 'mechanical-integration', 'power-control', 'custom');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. 创建关联表
CREATE TABLE IF NOT EXISTS "product_relations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "product_id" uuid NOT NULL,
  "related_product_id" uuid NOT NULL,
  "relation_type" "product_relation_type" DEFAULT 'custom' NOT NULL,
  "relation_label" varchar(100),
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 3. 添加外键约束
ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_product_id_products_id_fk" 
  FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_related_product_id_products_id_fk" 
  FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;

-- 4. 创建索引
CREATE UNIQUE INDEX IF NOT EXISTS "product_relations_unique" ON "product_relations" USING btree ("product_id","related_product_id");
CREATE INDEX IF NOT EXISTS "product_relations_product_idx" ON "product_relations" USING btree ("product_id","sort_order");
```

### 方式二：本地执行（需要 psql 客户端）

```bash
psql "postgresql://neondb_owner:npg_ZaA1Ruz9TUFv@ep-curly-field-a6wk13j5-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require" -f drizzle/0001_wealthy_solo.sql
```

### 验证

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_relations';
SELECT column_name FROM information_schema.columns WHERE table_name = 'product_relations' ORDER BY ordinal_position;
```

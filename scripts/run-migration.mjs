import { config } from 'dotenv';
import { writeFileSync } from 'fs';

config({ path: '.env.local' });

const log = [];
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  writeFileSync('migration-output.txt', 'DATABASE_URL not found\n');
  process.exit(1);
}

async function run() {
  try {
    const postgres = (await import('postgres')).default;
    log.push('postgres module loaded');
    const sql = postgres(DATABASE_URL);
    log.push('connected to database');

    // 1. Create enum
    await sql.unsafe(`DO $$ BEGIN
      CREATE TYPE "public"."product_relation_type" AS ENUM('drivers', 'mechanical-integration', 'power-control', 'custom');
    EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    log.push('OK: product_relation_type enum');

    // 2. Create table
    await sql.unsafe(`CREATE TABLE IF NOT EXISTS "product_relations" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "product_id" uuid NOT NULL,
      "related_product_id" uuid NOT NULL,
      "relation_type" "product_relation_type" DEFAULT 'custom' NOT NULL,
      "relation_label" varchar(100),
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp with time zone DEFAULT now() NOT NULL
    );`);
    log.push('OK: product_relations table');

    // 3. FK constraints
    await sql.unsafe(`DO $$ BEGIN
      ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_product_id_products_id_fk" 
        FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    log.push('OK: FK product_id');

    await sql.unsafe(`DO $$ BEGIN
      ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_related_product_id_products_id_fk" 
        FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;`);
    log.push('OK: FK related_product_id');

    // 4. Categories columns
    await sql.unsafe(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false NOT NULL;`);
    await sql.unsafe(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "featured_order" integer DEFAULT 0 NOT NULL;`);
    log.push('OK: categories columns');

    // 5. Indexes
    await sql.unsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "product_relations_unique" ON "product_relations" USING btree ("product_id","related_product_id");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS "product_relations_product_idx" ON "product_relations" USING btree ("product_id","sort_order");`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS "categories_featured_idx" ON "categories" USING btree ("is_featured","featured_order");`);
    log.push('OK: indexes');

    // Verify
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_relations'`;
    log.push(`verify: product_relations exists = ${tables.length > 0}`);

    if (tables.length > 0) {
      const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'product_relations' ORDER BY ordinal_position`;
      log.push(`columns: ${cols.map(c => c.column_name).join(', ')}`);
    }

    // Mark migration as applied in drizzle table
    try {
      await sql.unsafe(`CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at timestamp DEFAULT now()
      );`);
      await sql.unsafe(`INSERT INTO "__drizzle_migrations" (hash) VALUES ('0001_wealthy_solo') 
        ON CONFLICT DO NOTHING;`);
      log.push('OK: drizzle migration record');
    } catch (e) {
      log.push(`drizzle record: ${e.message}`);
    }

    await sql.end();
    log.push('DONE');
  } catch (err) {
    log.push(`ERROR: ${err.message}`);
    log.push(err.stack || '');
  }

  writeFileSync('migration-output.txt', log.join('\n'));
}

run();

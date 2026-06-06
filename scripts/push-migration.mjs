import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const sql = neon(process.env.DATABASE_URL);

const migrationSQL = readFileSync('./drizzle/0001_wealthy_solo.sql', 'utf-8');

try {
  await sql(migrationSQL);
  console.log('Migration completed successfully');
} catch (err) {
  console.error('Migration error:', err.message);
}

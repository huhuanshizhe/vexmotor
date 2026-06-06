import { writeFileSync } from 'fs';

writeFileSync('migration-output.txt', 'step1: script started\n');

try {
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
  writeFileSync('migration-output.txt', 'step2: dotenv loaded\n', { flag: 'a' });
  writeFileSync('migration-output.txt', `step3: DB_URL exists = ${!!process.env.DATABASE_URL}\n`, { flag: 'a' });

  const pg = await import('postgres');
  writeFileSync('migration-output.txt', 'step4: postgres imported\n', { flag: 'a' });

  const sql = pg.default(process.env.DATABASE_URL);
  writeFileSync('migration-output.txt', 'step5: connected\n', { flag: 'a' });

  const result = await sql`SELECT 1 as test`;
  writeFileSync('migration-output.txt', `step6: query result = ${JSON.stringify(result)}\n`, { flag: 'a' });

  await sql.end();
  writeFileSync('migration-output.txt', 'DONE\n', { flag: 'a' });
} catch (err) {
  writeFileSync('migration-output.txt', `ERROR: ${err.message}\n${err.stack}\n`, { flag: 'a' });
}

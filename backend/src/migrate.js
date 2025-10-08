import 'dotenv/config';
import { pool } from './db/index.js';
import { ensureSchema } from './setup.js';

async function main() {
  await ensureSchema(pool);
  // eslint-disable-next-line no-console
  console.log('Migration complete');
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});



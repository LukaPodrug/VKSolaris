export { pool } from './pool.js';

export async function withTransaction(run) {
  const client = await (await import('./pool.js')).pool.connect();
  try {
    await client.query('BEGIN');
    const result = await run(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}



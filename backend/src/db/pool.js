import { Pool } from 'pg';
import { env } from '../config/env.js';

// Neon provides a Postgres connection string. SSL must be enabled on Render.
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});



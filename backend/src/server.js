import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ensureSchema } from './setup.js';
import { pool } from './db/index.js';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import promosRoutes from './routes/promosRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import iapRoutes from './routes/iapRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes mounted below provide auth protection where needed

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Bootstrap schema and default admin
await ensureSchema(pool);


// Mount feature routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/promos', promosRoutes);
app.use('/wallet', walletRoutes);
app.use('/iap', iapRoutes);
app.use('/public', publicRoutes);

const port = env.port;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${port}`);
});



import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ensureSchema } from './setup.js';
import { pool } from './db/index.js';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import promosRoutes from './routes/promosRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import iapRoutes from './routes/iapRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import stripe from './webhooks/stripe.js';

const app = express();
app.use(cors());
// Stripe webhook needs raw body for signature verification; JSON elsewhere
app.use((req, res, next) => {
  if (req.path === '/webhooks/stripe') {
    return bodyParser.raw({ type: '*/*' })(req, res, next);
  }
  return express.json()(req, res, next);
});

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
app.post('/webhooks/stripe', stripe);

const port = env.port;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on ${port}`);
});



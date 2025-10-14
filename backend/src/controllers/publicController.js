import { pool } from '../db/index.js';
import Stripe from 'stripe';
import { env } from '../config/env.js';
import bcrypt from 'bcrypt';

export async function registerUser(req, res) {
  const { firstName, lastName, username, password } = req.body || {};
  if (!firstName || !lastName || !username || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const existing = await pool.query('SELECT 1 FROM users WHERE username=$1', [username]);
    if (existing.rows.length) return res.status(409).json({ error: 'Username already taken' });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (first_name, last_name, username, password_hash, status) VALUES ($1,$2,$3,$4,$5) RETURNING id, status, member_id, username',
      [firstName, lastName, username, hash, 'pending']
    );
    res.status(201).json({ userId: rows[0].id, memberId: rows[0].member_id, status: rows[0].status, username: rows[0].username });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Member already registered' });
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function getUserStatus(req, res) {
  const { memberId } = req.query;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const { rows } = await pool.query('SELECT id, member_id, status FROM users WHERE member_id=$1', [memberId]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function getActivePromo(_req, res) {
  // Return the most recent active promo (admin-managed) if any
  const { rows } = await pool.query(
    `SELECT code FROM promo_codes WHERE is_active = true ORDER BY updated_at DESC NULLS LAST, created_at DESC LIMIT 1`
  );
  if (!rows.length) return res.json({ code: null });
  return res.json({ code: rows[0].code });
}

function getStripeClient() {
  return new Stripe(env.stripeSecretKey, { apiVersion: '2024-06-20' });
}

export async function createCheckoutSession(req, res) {
  const { memberId, promoCode } = req.body || {};
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const stripe = getStripeClient();

  const successUrl = `${env.publicAppBaseUrl}/success?memberId=${encodeURIComponent(memberId)}`;
  const cancelUrl = `${env.publicAppBaseUrl}/cancel`;

  const params = {
    mode: 'subscription',
    line_items: [{ price: env.stripePriceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { memberId },
  };

  if (promoCode) {
    params.discounts = [{ promotion_code: promoCode }];
  }

  try {
    const session = await stripe.checkout.sessions.create(params);
    // Upsert a pending subscription record for this user
    const { rows } = await pool.query('SELECT id FROM users WHERE member_id=$1', [memberId]);
    const user = rows[0];
    if (user) {
      await pool.query(
        `INSERT INTO subscriptions (user_id, stripe_checkout_session_id, status)
         VALUES ($1,$2,'pending')
         ON CONFLICT (user_id) DO UPDATE SET stripe_checkout_session_id=$2, status='pending', updated_at=now()`,
        [user.id, session.id]
      );
    }
    return res.status(201).json({ id: session.id, url: session.url });
  } catch (e) {
    return res.status(400).json({ error: e.message || 'Stripe error' });
  }
}

export async function getPurchaseStatus(req, res) {
  const memberId = req.query.memberId;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const { rows } = await pool.query(
    `SELECT s.status FROM subscriptions s
     JOIN users u ON u.id = s.user_id
     WHERE u.member_id=$1`,
    [memberId]
  );
  if (!rows.length) return res.json({ status: 'none' });
  return res.json({ status: rows[0].status });
}

export async function publicLogin(req, res) {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const { rows } = await pool.query('SELECT id, member_id, status, password_hash FROM users WHERE username=$1', [username]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  return res.json({ memberId: user.member_id, status: user.status });
}

export async function issueWalletByMember(req, res) {
  const { memberId } = req.body || {};
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const { rows: urows } = await pool.query('SELECT id, first_name, last_name, member_id FROM users WHERE member_id=$1', [memberId]);
  if (!urows.length) return res.status(404).json({ error: 'User not found' });
  const user = urows[0];
  const { rows: srows } = await pool.query('SELECT status FROM subscriptions WHERE user_id=$1', [user.id]);
  const active = srows.length && srows[0].status === 'active';
  if (!active) return res.status(400).json({ error: 'Subscription not active' });
  // Point to dynamic endpoints that generate wallet artifacts
  const appleUrl = `${env.publicAppBaseUrl}/wallet/apple/pass?memberId=${encodeURIComponent(user.member_id)}`;
  const googleUrl = `${env.publicAppBaseUrl}/wallet/google/save-link?memberId=${encodeURIComponent(user.member_id)}`;
  const { rows } = await pool.query(
    `INSERT INTO wallet_cards (user_id, first_name, last_name, member_id, status, expires_at, apple_pass_url, google_wallet_url)
     VALUES ($1,$2,$3,$4,'active', now() + interval '1 year', $5, $6)
     ON CONFLICT (user_id) DO UPDATE SET status='active', expires_at=now() + interval '1 year', apple_pass_url=$5, google_wallet_url=$6, updated_at=now()
     RETURNING id, apple_pass_url, google_wallet_url, status, expires_at`,
    [user.id, user.first_name, user.last_name, user.member_id, appleUrl, googleUrl]
  );
  // Placeholder: In future, generate actual Apple/Google wallet URLs
  const card = rows[0];
  return res.json({
    status: card.status,
    expiresAt: card.expires_at,
    applePassUrl: card.apple_pass_url || null,
    googleWalletUrl: card.google_wallet_url || null,
  });
}



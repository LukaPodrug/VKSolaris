import { pool } from '../db/index.js';

export async function listPromos(_req, res) {
  const { rows } = await pool.query('SELECT * FROM promo_codes ORDER BY created_at DESC');
  res.json(rows);
}

export async function createPromo(req, res) {
  const { code, discountPercent, expiresAt, usageLimit, isActive } = req.body || {};
  if (!code || discountPercent == null) return res.status(400).json({ error: 'code and discountPercent required' });
  const { rows } = await pool.query(
    `INSERT INTO promo_codes (code, discount_percent, expires_at, usage_limit, is_active)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [code, discountPercent, expiresAt ?? null, usageLimit ?? null, isActive ?? true]
  );
  res.status(201).json(rows[0]);
}

export async function updatePromo(req, res) {
  const id = req.params.id;
  const { isActive } = req.body || {};
  const { rows } = await pool.query('UPDATE promo_codes SET is_active = COALESCE($1, is_active), updated_at=now() WHERE id=$2 RETURNING *', [isActive, id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function deletePromo(req, res) {
  const id = req.params.id;
  await pool.query('DELETE FROM promo_codes WHERE id=$1', [id]);
  res.status(204).end();
}



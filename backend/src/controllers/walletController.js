import { pool } from '../db/index.js';

export async function issueWallet(req, res) {
  const userId = Number(req.params.userId);
  const { firstName, lastName, memberId, customDesign } = req.body || {};
  const { rows } = await pool.query(
    `INSERT INTO wallet_cards (user_id, first_name, last_name, member_id, design_json, status, expires_at)
     VALUES ($1,$2,$3,$4,$5,'active', now() + interval '1 year')
     ON CONFLICT (user_id) DO UPDATE SET first_name=EXCLUDED.first_name, last_name=EXCLUDED.last_name, member_id=EXCLUDED.member_id, design_json=EXCLUDED.design_json, status='active', expires_at=now() + interval '1 year', updated_at=now()
     RETURNING *`,
    [userId, firstName, lastName, memberId, customDesign ? JSON.stringify(customDesign) : null]
  );
  res.json(rows[0]);
}

export async function getWallet(req, res) {
  const userId = req.params.userId;
  const { rows } = await pool.query('SELECT * FROM wallet_cards WHERE user_id=$1', [userId]);
  if (!rows.length) return res.status(404).json({ error: 'No card' });
  res.json(rows[0]);
}



import { pool } from '../db/index.js';

export async function registerUser(req, res) {
  const { firstName, lastName, memberId } = req.body || {};
  if (!firstName || !lastName || !memberId) return res.status(400).json({ error: 'Missing fields' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (first_name, last_name, member_id, status) VALUES ($1,$2,$3,$4) RETURNING id, status',
      [firstName, lastName, memberId, 'pending']
    );
    res.status(201).json({ userId: rows[0].id, status: rows[0].status });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Member already registered' });
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function getUserStatus(req, res) {
  const { memberId } = req.query;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const { rows } = await pool.query('SELECT id, status FROM users WHERE member_id=$1', [memberId]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}



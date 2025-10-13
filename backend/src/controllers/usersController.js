import { pool } from '../db/index.js';

export async function listUsers(req, res) {
  const { status } = req.query;
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = 'WHERE status = $1';
  }
  const { rows } = await pool.query(
    `SELECT id, first_name, last_name, member_id, status, created_at, updated_at FROM users ${where} ORDER BY created_at DESC`,
    params
  );
  res.json(rows);
}

export async function createUser(req, res) {
  const { firstName, lastName } = req.body || {};
  if (!firstName || !lastName) return res.status(400).json({ error: 'Missing fields' });
  const { rows } = await pool.query(
    'INSERT INTO users (first_name, last_name, status) VALUES ($1,$2,$3) RETURNING *',
    [firstName, lastName, 'pending']
  );
  res.status(201).json(rows[0]);
}

export async function approveUser(req, res) {
  const id = req.params.id;
  const { rows } = await pool.query('UPDATE users SET status=$1, updated_at=now() WHERE id=$2 RETURNING *', ['active', id]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
}

export async function suspendUser(req, res) {
  const id = req.params.id;
  const { rows } = await pool.query('UPDATE users SET status=$1, updated_at=now() WHERE id=$2 RETURNING *', ['suspended', id]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
}



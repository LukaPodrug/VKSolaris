import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/index.js';
import { env } from '../config/env.js';

function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const { rows } = await pool.query('SELECT id, email, password_hash FROM admins WHERE email=$1', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const admin = rows[0];
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ adminId: admin.id, email: admin.email });
  res.json({ token });
}



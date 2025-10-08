import { pool } from '../db/index.js';

function mapDiscountToOffering(discountPercent) {
  if (discountPercent === 100) return 'yearly_membership_free';
  if (discountPercent === 50) return 'yearly_membership_50_discount';
  return 'yearly_membership';
}

export async function getOfferingForUser(req, res) {
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const { rows: userRows } = await pool.query('SELECT id FROM users WHERE id=$1', [userId]);
  if (!userRows.length) return res.status(404).json({ error: 'User not found' });

  const { rows: promoRows } = await pool.query('SELECT discount_percent FROM user_promotions WHERE user_id=$1', [userId]);
  const discount = promoRows.length ? promoRows[0].discount_percent : null;
  const offeringId = mapDiscountToOffering(discount ?? 0);
  return res.json({ offeringId });
}



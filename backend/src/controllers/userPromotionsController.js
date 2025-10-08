import { pool } from '../db/index.js';

export async function applyPromo(req, res) {
  const id = Number(req.params.id);
  const { code, discountPercent } = req.body || {};
  let promoId = null;
  let percent = discountPercent ?? null;
  try {
    await pool.query('BEGIN');
    if (code) {
      const { rows: promoRows } = await pool.query(
        `SELECT * FROM promo_codes WHERE code=$1 AND is_active=true AND (expires_at IS NULL OR expires_at > now())`,
        [code]
      );
      if (!promoRows.length) throw new Error('Invalid or expired code');
      const promo = promoRows[0];
      promoId = promo.id;
      percent = promo.discount_percent;
      if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) throw new Error('Code usage exceeded');
      await pool.query('UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id=$1', [promoId]);
    }
    if (percent == null) throw new Error('Provide code or discountPercent');

    await pool.query(
      `INSERT INTO user_promotions (user_id, promo_code_id, discount_percent) VALUES ($1,$2,$3)
       ON CONFLICT (user_id) DO UPDATE SET promo_code_id=EXCLUDED.promo_code_id, discount_percent=EXCLUDED.discount_percent, updated_at=now()`,
      [id, promoId, percent]
    );
    await pool.query('COMMIT');
    res.json({ userId: id, discountPercent: percent, promoCodeId: promoId });
  } catch (e) {
    await pool.query('ROLLBACK');
    res.status(400).json({ error: e.message });
  }
}



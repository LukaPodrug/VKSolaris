import Stripe from 'stripe';
import { env } from '../config/env.js';
import { pool } from '../db/index.js';

const stripe = new Stripe(env.stripeSecretKey, { apiVersion: '2024-06-20' });

export default async function stripeWebhook(req, res) {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    if (!sig) return res.status(400).json({ error: 'Missing stripe-signature' });
    const rawBody = req.body; // Buffer from bodyParser.raw
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const memberId = session.metadata?.memberId;
        if (memberId) {
          const { rows } = await pool.query('SELECT id FROM users WHERE member_id=$1', [memberId]);
          if (rows.length) {
            const userId = rows[0].id;
            await pool.query(
              `INSERT INTO subscriptions (user_id, stripe_checkout_session_id, status)
               VALUES ($1,$2,'active')
               ON CONFLICT (user_id) DO UPDATE SET stripe_checkout_session_id=$2, status='active', updated_at=now()`,
              [userId, session.id]
            );
            // Optionally flip user status to confirmed/active
            await pool.query(`UPDATE users SET status='confirmed' WHERE id=$1`, [userId]);
          }
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const stripeSubscriptionId = subscription.id;
        const status = subscription.status; // active, canceled, past_due, etc.
        await pool.query(
          `UPDATE subscriptions SET stripe_subscription_id=$1, status=$2, current_period_end=to_timestamp($3), updated_at=now()
           WHERE stripe_subscription_id=$1`,
          [stripeSubscriptionId, status, Math.floor(subscription.current_period_end)]
        );
        break;
      }
      default:
        break;
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  res.json({ received: true });
}

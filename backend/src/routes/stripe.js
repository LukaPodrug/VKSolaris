import express from 'express';
import Stripe from 'stripe';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Season ticket price configuration
const SEASON_TICKET_PRICE = 10000; // $100.00 in cents

// Create payment intent for season ticket
router.post('/create-payment-intent', [
  authenticateToken,
  body('currency').optional().isIn(['usd', 'eur']).default('usd')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { currency = 'usd' } = req.body;
    const currentYear = new Date().getFullYear();

    // Check if user can purchase ticket
    const existingTicket = await pool.query(
      'SELECT id FROM season_tickets WHERE user_id = $1 AND season_year = $2',
      [req.user.id, currentYear]
    );

    if (existingTicket.rows.length > 0) {
      return res.status(400).json({ 
        message: 'You already have a season ticket for this year' 
      });
    }

    if (req.user.status !== 'confirmed') {
      return res.status(403).json({ 
        message: 'Your account must be confirmed to purchase tickets' 
      });
    }

    // Get user's discount percentage
    const userResult = await pool.query(
      'SELECT discount_percentage, stripe_customer_id FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = userResult.rows[0];
    const discountPercentage = user.discount_percentage || 0;
    
    // Calculate final amount with discount
    const discountAmount = Math.round(SEASON_TICKET_PRICE * (discountPercentage / 100));
    const finalAmount = SEASON_TICKET_PRICE - discountAmount;

    // Create or retrieve Stripe customer
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: req.user.id.toString(),
          username: req.user.username
        }
      });
      
      customerId = customer.id;
      
      // Update user with customer ID
      await pool.query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, req.user.id]
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency,
      customer: customerId,
      metadata: {
        userId: req.user.id.toString(),
        seasonYear: currentYear.toString(),
        originalAmount: SEASON_TICKET_PRICE.toString(),
        discountPercentage: discountPercentage.toString(),
        discountAmount: discountAmount.toString()
      },
      description: `Solaris Waterpolo Club - Season Ticket ${currentYear}`
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: finalAmount,
      originalAmount: SEASON_TICKET_PRICE,
      discountPercentage,
      discountAmount,
      currency
    });
  } catch (error) {
    next(error);
  }
});

// Confirm payment and create season ticket
router.post('/confirm-payment', [
  authenticateToken,
  body('paymentIntentId').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        message: 'Payment not completed successfully' 
      });
    }

    // Verify the payment belongs to this user
    if (paymentIntent.metadata.userId !== req.user.id.toString()) {
      return res.status(403).json({ 
        message: 'Payment does not belong to this user' 
      });
    }

    const seasonYear = parseInt(paymentIntent.metadata.seasonYear);

    // Check if ticket already exists (prevent double creation)
    const existingTicket = await pool.query(
      'SELECT id FROM season_tickets WHERE user_id = $1 AND season_year = $2',
      [req.user.id, seasonYear]
    );

    if (existingTicket.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Season ticket already exists for this year' 
      });
    }

    // Create season ticket record
    const ticketResult = await pool.query(
      `INSERT INTO season_tickets 
       (user_id, season_year, amount_paid, stripe_payment_intent_id, ticket_type) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, season_year, purchase_date, amount_paid`,
      [
        req.user.id,
        seasonYear,
        paymentIntent.amount / 100, // Convert from cents to dollars
        paymentIntentId,
        'regular'
      ]
    );

    // Update user's season ticket status
    await pool.query(
      `UPDATE users 
       SET has_season_ticket = TRUE, season_ticket_year = $1 
       WHERE id = $2`,
      [seasonYear, req.user.id]
    );

    const ticket = ticketResult.rows[0];

    res.json({
      message: 'Season ticket purchased successfully',
      ticket: {
        id: ticket.id,
        seasonYear: ticket.season_year,
        purchaseDate: ticket.purchase_date,
        amountPaid: ticket.amount_paid
      }
    });
  } catch (error) {
    next(error);
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        // Additional processing if needed
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});

// Get season ticket pricing info
router.get('/pricing', authenticateToken, async (req, res, next) => {
  try {
    const userResult = await pool.query(
      'SELECT discount_percentage FROM users WHERE id = $1',
      [req.user.id]
    );

    const discountPercentage = userResult.rows[0]?.discount_percentage || 0;
    const discountAmount = Math.round(SEASON_TICKET_PRICE * (discountPercentage / 100));
    const finalAmount = SEASON_TICKET_PRICE - discountAmount;

    res.json({
      originalPrice: SEASON_TICKET_PRICE / 100, // Convert to dollars
      discountPercentage,
      discountAmount: discountAmount / 100,
      finalPrice: finalAmount / 100,
      currency: 'USD'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
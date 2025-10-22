import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, first_name, last_name, username, email, status, 
        has_season_ticket, discount_percentage, season_ticket_year,
        created_at, updated_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        status: user.status,
        hasSeasonTicket: user.has_season_ticket,
        discountPercentage: user.discount_percentage,
        seasonTicketYear: user.season_ticket_year,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.patch('/me', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 2, max: 100 }).escape(),
  body('lastName').optional().trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email } = req.body;
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (firstName) {
      updates.push(`first_name = $${paramIndex}`);
      values.push(firstName);
      paramIndex++;
    }

    if (lastName) {
      updates.push(`last_name = $${paramIndex}`);
      values.push(lastName);
      paramIndex++;
    }

    if (email) {
      // Check if email is already taken by another user
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, req.user.id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      updates.push(`email = $${paramIndex}`);
      values.push(email);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.user.id);

    const result = await pool.query(
      `UPDATE users 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, first_name, last_name, username, email, status`,
      values
    );

    const user = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's season tickets
router.get('/season-tickets', authenticateToken, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, season_year, purchase_date, amount_paid, 
        ticket_type, is_active
       FROM season_tickets 
       WHERE user_id = $1 
       ORDER BY season_year DESC`,
      [req.user.id]
    );

    res.json({
      seasonTickets: result.rows.map(ticket => ({
        id: ticket.id,
        seasonYear: ticket.season_year,
        purchaseDate: ticket.purchase_date,
        amountPaid: ticket.amount_paid,
        ticketType: ticket.ticket_type,
        isActive: ticket.is_active
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Check if user can purchase season ticket
router.get('/can-purchase-ticket', authenticateToken, async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Check if user already has a ticket for current year
    const existingTicket = await pool.query(
      'SELECT id FROM season_tickets WHERE user_id = $1 AND season_year = $2',
      [req.user.id, currentYear]
    );

    const canPurchase = existingTicket.rows.length === 0 && req.user.status === 'confirmed';

    res.json({
      canPurchase,
      currentYear,
      userStatus: req.user.status,
      hasCurrentYearTicket: existingTicket.rows.length > 0
    });
  } catch (error) {
    next(error);
  }
});

export default router;
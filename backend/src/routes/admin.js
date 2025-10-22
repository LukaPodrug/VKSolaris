import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all users with pagination and filtering
router.get('/users', authenticateAdmin, async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      search,
      hasSeasonTicket 
    } = req.query;

    const offset = (page - 1) * limit;
    let queryConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status) {
      queryConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (hasSeasonTicket !== undefined) {
      queryConditions.push(`has_season_ticket = $${paramIndex}`);
      queryParams.push(hasSeasonTicket === 'true');
      paramIndex++;
    }

    if (search) {
      queryConditions.push(`(
        first_name ILIKE $${paramIndex} OR 
        last_name ILIKE $${paramIndex} OR 
        username ILIKE $${paramIndex} OR 
        email ILIKE $${paramIndex}
      )`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = queryConditions.length > 0 ? 
      `WHERE ${queryConditions.join(' AND ')}` : '';

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );

    // Get users
    const usersResult = await pool.query(
      `SELECT 
        id, first_name, last_name, username, email, status, 
        has_season_ticket, discount_percentage, season_ticket_year,
        created_at, updated_at
       FROM users 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...queryParams, limit, offset]
    );

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users: usersResult.rows.map(user => ({
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
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single user details
router.get('/users/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        u.id, u.first_name, u.last_name, u.username, u.email, u.status, 
        u.has_season_ticket, u.discount_percentage, u.season_ticket_year,
        u.stripe_customer_id, u.wallet_pass_id, u.created_at, u.updated_at,
        st.id as ticket_id, st.season_year, st.purchase_date, st.amount_paid,
        st.ticket_type, st.is_active
       FROM users u
       LEFT JOIN season_tickets st ON u.id = st.user_id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRow = result.rows[0];
    const user = {
      id: userRow.id,
      firstName: userRow.first_name,
      lastName: userRow.last_name,
      username: userRow.username,
      email: userRow.email,
      status: userRow.status,
      hasSeasonTicket: userRow.has_season_ticket,
      discountPercentage: userRow.discount_percentage,
      seasonTicketYear: userRow.season_ticket_year,
      stripeCustomerId: userRow.stripe_customer_id,
      walletPassId: userRow.wallet_pass_id,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
      seasonTickets: result.rows
        .filter(row => row.ticket_id)
        .map(row => ({
          id: row.ticket_id,
          seasonYear: row.season_year,
          purchaseDate: row.purchase_date,
          amountPaid: row.amount_paid,
          ticketType: row.ticket_type,
          isActive: row.is_active
        }))
    };

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user status
router.patch('/users/:id/status', [
  authenticateAdmin,
  body('status').isIn(['pending', 'confirmed', 'suspended'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, first_name, last_name, username, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      message: 'User status updated successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user discount percentage
router.patch('/users/:id/discount', [
  authenticateAdmin,
  body('discountPercentage').isInt({ min: 0, max: 100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { discountPercentage } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET discount_percentage = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, first_name, last_name, username, discount_percentage`,
      [discountPercentage, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      message: 'User discount updated successfully',
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        discountPercentage: user.discount_percentage
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', authenticateAdmin, async (req, res, next) => {
  try {
    const stats = await Promise.all([
      // Total users
      pool.query('SELECT COUNT(*) as count FROM users'),
      // Users by status
      pool.query(`
        SELECT status, COUNT(*) as count 
        FROM users 
        GROUP BY status
      `),
      // Season tickets sold this year
      pool.query(`
        SELECT COUNT(*) as count 
        FROM season_tickets 
        WHERE season_year = EXTRACT(YEAR FROM CURRENT_DATE)
      `),
      // Revenue this year
      pool.query(`
        SELECT COALESCE(SUM(amount_paid), 0) as total 
        FROM season_tickets 
        WHERE season_year = EXTRACT(YEAR FROM CURRENT_DATE)
      `),
      // Recent registrations (last 30 days)
      pool.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      `)
    ]);

    const usersByStatus = {};
    stats[1].rows.forEach(row => {
      usersByStatus[row.status] = parseInt(row.count);
    });

    res.json({
      totalUsers: parseInt(stats[0].rows[0].count),
      usersByStatus,
      seasonTicketsSold: parseInt(stats[2].rows[0].count),
      revenue: parseFloat(stats[3].rows[0].total),
      recentRegistrations: parseInt(stats[4].rows[0].count)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
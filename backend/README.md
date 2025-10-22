# Solaris Backend

Express.js backend API for the Solaris Waterpolo Club season ticket management system.

## Features

- User authentication and registration
- Admin authentication and user management
- Stripe payment integration for season tickets
- PostgreSQL database with Neon hosting
- JWT-based authentication
- Input validation and sanitization
- Rate limiting and security headers
- Error handling middleware

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `JWT_SECRET`: Strong secret for JWT tokens
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

4. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/season-tickets` - Get user's season tickets
- `GET /api/users/can-purchase-ticket` - Check if user can purchase ticket

### Admin
- `GET /api/admin/users` - Get all users (paginated)
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/status` - Update user status
- `PATCH /api/admin/users/:id/discount` - Update user discount
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Stripe Payments
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/confirm-payment` - Confirm payment and create ticket
- `POST /api/stripe/webhook` - Stripe webhook handler
- `GET /api/stripe/pricing` - Get pricing information

## Database Schema

### Users Table
- `id` - Primary key
- `first_name` - User's first name
- `last_name` - User's last name
- `username` - Unique username
- `email` - User's email (optional)
- `password_hash` - Hashed password
- `status` - Account status (pending, confirmed, suspended)
- `discount_percentage` - Discount percentage (0-100)
- `has_season_ticket` - Boolean flag
- `season_ticket_year` - Year of current season ticket
- `stripe_customer_id` - Stripe customer ID
- `wallet_pass_id` - Wallet pass ID
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Admin Users Table
- `id` - Primary key
- `username` - Admin username
- `email` - Admin email
- `password_hash` - Hashed password
- `role` - Admin role (admin, super_admin)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Season Tickets Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `season_year` - Year of the season
- `purchase_date` - Purchase timestamp
- `amount_paid` - Amount paid in dollars
- `stripe_payment_intent_id` - Stripe payment intent ID
- `ticket_type` - Type of ticket (regular, etc.)
- `is_active` - Boolean flag
- `created_at` - Creation timestamp

## Deployment

This backend is designed to be deployed on Render.com:

1. Connect your GitHub repository to Render
2. Set up environment variables in Render dashboard
3. Deploy with Node.js environment

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Security headers with Helmet
- SQL injection prevention with parameterized queries

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `FRONTEND_URL` - Frontend application URL
- `ADMIN_URL` - Admin dashboard URL
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window
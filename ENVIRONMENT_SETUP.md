# Environment Variables Setup Guide

## 🗃️ How to Get Your Environment Variable Values

### 1. Database URL (Neon)
1. Go to [neon.tech](https://neon.tech) and log into your account
2. Select your project/database
3. Go to "Connection Details" or "Dashboard"
4. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-something.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Paste this as your `DATABASE_URL` in `backend/.env`

### 2. JWT Secret
Generate a secure random string:
```bash
# Run this command in terminal to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and use it as your `JWT_SECRET` in `backend/.env`

### 3. Stripe Keys
1. Go to [stripe.com](https://stripe.com) and log into your dashboard
2. Make sure you're in "Test mode" (toggle in top right)
3. Go to "Developers" → "API keys"
4. Copy:
   - **Publishable key** (starts with `pk_test_`) → use in `mobile-app/.env` as `STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_test_`) → use in `backend/.env` as `STRIPE_SECRET_KEY`

### 4. Stripe Webhook Secret
1. In Stripe dashboard, go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Set endpoint URL as: `http://localhost:3000/api/stripe/webhook` (for development)
4. Select events: `payment_intent.succeeded` and `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Click on the created webhook and reveal the "Signing secret"
7. Copy the secret (starts with `whsec_`) → use in `backend/.env` as `STRIPE_WEBHOOK_SECRET`

## 📁 Where to Put Environment Variables

### Development (Local)
- `backend/.env` - Already created ✅
- `admin-frontend/.env` - Already created ✅ 
- `mobile-app/.env` - Already created ✅

### Production Deployment

#### Backend (Render.com)
1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add each variable:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (your Neon connection string)
   - `JWT_SECRET` = (your generated secret)
   - `STRIPE_SECRET_KEY` = (your live Stripe secret key)
   - `STRIPE_WEBHOOK_SECRET` = (your webhook secret)
   - `FRONTEND_URL` = `https://your-admin-app.netlify.app`
   - `ADMIN_URL` = `https://your-admin-app.netlify.app`

#### Admin Frontend (Netlify)
1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Add:
   - `REACT_APP_API_URL` = `https://your-backend.onrender.com/api`

#### Mobile App
Environment variables are bundled during build time, so make sure your `.env` file has production values when building for release.

## 🔧 Quick Setup Commands

After getting your actual values, update the files:

```bash
# 1. Navigate to project root
cd /Users/lukapodrug/Desktop/Solaris

# 2. Update backend environment variables
nano backend/.env
# (or use any text editor to replace the placeholder values)

# 3. Update admin frontend environment variables  
nano admin-frontend/.env
# (replace with your backend URL)

# 4. Update mobile app environment variables
nano mobile-app/.env
# (replace with your Stripe publishable key and backend URL)

# 5. Install dependencies and start development
cd backend && npm install
cd ../admin-frontend && npm install  
cd ../mobile-app && npm install
```

## 🧪 Testing Your Setup

### 1. Test Backend
```bash
cd backend
npm run dev
# Should see: "🚀 Server running on port 3000" and "🐘 Connected to PostgreSQL database"
```

### 2. Test Admin Frontend
```bash
cd admin-frontend
npm start
# Should open browser at http://localhost:3001
```

### 3. Test Mobile App
```bash
cd mobile-app
# For iOS:
npm run ios
# For Android:
npm run android
```

## ⚠️ Important Security Notes

1. **Never commit `.env` files** to version control
2. **Use test keys** for development
3. **Use live keys** only for production
4. **Rotate secrets** regularly
5. **Use different secrets** for different environments

## 🎯 Sample Values for Quick Testing

If you want to test the structure before setting up real accounts:

```env
# backend/.env (example values - replace with real ones)
DATABASE_URL=postgresql://user:pass@localhost:5432/solaris_test
JWT_SECRET=abcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab
STRIPE_SECRET_KEY=sk_test_51ABC123DEF456...
STRIPE_WEBHOOK_SECRET=whsec_ABC123DEF456...
```

## 🆘 Troubleshooting

- **Database connection fails**: Check your Neon connection string and ensure the database is running
- **Stripe errors**: Verify your API keys are correct and you're in the right mode (test/live)
- **CORS errors**: Make sure your frontend URLs match the ones in `FRONTEND_URL` and `ADMIN_URL`
- **JWT errors**: Ensure your JWT secret is at least 32 characters long
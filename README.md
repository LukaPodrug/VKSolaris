# Solaris Waterpolo Club - Season Ticket Management System

A comprehensive full-stack application for managing season tickets for Solaris waterpolo club, featuring user registration, Stripe payment integration, digital wallet support, and admin management.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Admin Frontend  │    │   PostgreSQL    │
│  (React Native) │    │     (React)      │    │   (Neon DB)     │
└─────────┬───────┘    └────────┬─────────┘    └─────────┬───────┘
          │                     │                        │
          │                     │                        │
          └─────────────────────┼────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │     Backend API        │
                    │     (Express.js)       │
                    │   Hosted on Render     │
                    └───────────┬────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Stripe Payments      │
                    │   Apple/Google Wallet  │
                    └────────────────────────┘
```

## 📁 Project Structure

```
solaris/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── middleware/     # Authentication and error handling
│   │   ├── routes/         # API route handlers
│   │   └── index.js        # Main server file
│   ├── package.json
│   └── README.md
├── admin-frontend/         # React admin dashboard
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API integration
│   │   └── App.js          # Main app component
│   ├── package.json
│   └── README.md
├── mobile-app/             # React Native mobile app
│   ├── src/
│   │   ├── components/     # Mobile UI components
│   │   ├── contexts/       # App state management
│   │   ├── navigation/     # Navigation configuration
│   │   ├── screens/        # App screens
│   │   ├── services/       # API and payment services
│   │   └── App.js          # Main app component
│   ├── package.json
│   └── README.md
├── shared/                 # Shared utilities and constants
│   ├── src/
│   │   ├── constants.js    # Application constants
│   │   ├── validation.js   # Validation functions
│   │   ├── utils.js        # Utility functions
│   │   └── index.js        # Main export file
│   ├── package.json
│   └── README.md
├── .github/
│   └── copilot-instructions.md
└── README.md               # This file
```

## 🚀 Features

### User Features (Mobile App)
- **User Registration**: Create account with name, username, and password
- **Authentication**: Secure login with JWT tokens
- **Season Ticket Purchase**: Buy tickets using Stripe payment processing
- **Digital Wallet**: Add tickets to Apple Wallet or Google Wallet
- **Profile Management**: Update personal information
- **Ticket History**: View past and current season tickets
- **Discount Support**: Automatic discount application based on admin settings

### Admin Features (Web Dashboard)
- **User Management**: View all registered users with advanced filtering
- **Status Control**: Approve, suspend, or manage user accounts
- **Discount Management**: Set individual discount percentages (0-100%)
- **Analytics Dashboard**: Real-time statistics and user insights
- **Payment Tracking**: Monitor season ticket sales and revenue
- **User Details**: Comprehensive user profiles with purchase history

### Technical Features
- **Secure Payments**: Stripe integration with PCI compliance
- **Digital Wallets**: Apple Wallet and Google Wallet integration
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first UI across all platforms
- **Type Safety**: Shared types and validation across all components
- **Error Handling**: Comprehensive error management and user feedback

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Neon)
- **Authentication**: JWT with bcrypt
- **Payments**: Stripe API
- **Hosting**: Render.com

### Frontend (Admin)
- **Framework**: React 18
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Charts**: Recharts
- **Hosting**: Netlify

### Mobile App
- **Framework**: React Native 0.72+
- **Navigation**: React Navigation v6
- **Payments**: Stripe React Native SDK
- **Storage**: AsyncStorage + Keychain
- **State Management**: React Query + Context API
- **Icons**: React Native Vector Icons

### Shared
- **Language**: JavaScript (ES6+)
- **Validation**: Custom validation functions
- **Constants**: Centralized configuration
- **Utilities**: Common helper functions

## 📱 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Neon account)
- Stripe account for payments
- React Native development environment (for mobile)

### 1. Database Setup (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create new PostgreSQL database
3. Note connection string for environment configuration

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

**Environment Variables:**
```env
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Admin Frontend Setup
```bash
cd admin-frontend
npm install
# Create .env file
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env
npm start
```

### 4. Mobile App Setup
```bash
cd mobile-app
npm install
# iOS setup
cd ios && pod install && cd ..
# Android setup (ensure Android Studio is configured)
npm run android  # or npm run ios
```

### 5. Shared Package
```bash
cd shared
npm install
npm test
```

## 🔧 Configuration

### Stripe Configuration
1. Create Stripe account and get API keys
2. Configure webhook endpoints:
   - Backend: `https://your-backend.render.com/api/stripe/webhook`
3. Set up Apple/Google Pay in Stripe dashboard

### Database Schema
The application automatically creates required tables:
- `users` - User accounts and profiles
- `admin_users` - Admin accounts
- `season_tickets` - Ticket purchase records

### Environment Variables

#### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3001
ADMIN_URL=http://localhost:3002
```

#### Admin Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000/api
```

#### Mobile App (.env)
```env
API_BASE_URL=http://localhost:3000/api
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repository to Render
2. Create new Web Service
3. Configure environment variables
4. Deploy from `backend` directory

### Admin Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables
5. Add redirects: `/*    /index.html   200`

### Mobile App
#### iOS (App Store)
1. Configure signing in Xcode
2. Archive and upload to App Store Connect
3. Configure app metadata and submit for review

#### Android (Google Play)
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Configure store listing and publish

## 👥 User Workflow

### User Registration & Purchase Flow
1. **Registration**: User creates account with basic information
2. **Admin Approval**: Admin reviews and confirms user account
3. **Purchase**: User buys season ticket through Stripe
4. **Wallet Integration**: User adds ticket to mobile wallet
5. **Access**: User uses digital ticket for game entry

### Admin Management Flow
1. **Dashboard Overview**: View key metrics and recent activity
2. **User Management**: Review new registrations and manage existing users
3. **Status Control**: Approve users, set discounts, suspend accounts
4. **Analytics**: Monitor sales, revenue, and user engagement

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet Security**: Security headers for web applications
- **Stripe Security**: PCI-compliant payment processing

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### User Endpoints
- `GET /api/users/me` - Get user profile
- `PATCH /api/users/me` - Update user profile
- `GET /api/users/season-tickets` - Get user's tickets
- `GET /api/users/can-purchase-ticket` - Check purchase eligibility

### Admin Endpoints
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/status` - Update user status
- `PATCH /api/admin/users/:id/discount` - Update user discount
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Payment Endpoints
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `POST /api/stripe/confirm-payment` - Confirm payment
- `GET /api/stripe/pricing` - Get pricing information
- `POST /api/stripe/webhook` - Stripe webhook handler

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd admin-frontend
npm test
```

### Mobile App Testing
```bash
cd mobile-app
npm test
```

## 📈 Future Enhancements

### Planned Features
- **Contentful CMS**: Article management and display
- **Push Notifications**: Event and announcement notifications
- **Social Features**: User comments and community features
- **Analytics Dashboard**: Advanced reporting and insights
- **Multi-language Support**: Internationalization
- **Offline Support**: Cached data and offline functionality

### Technical Improvements
- **TypeScript Migration**: Enhanced type safety
- **GraphQL API**: More efficient data fetching
- **Microservices**: Service decomposition for scalability
- **Docker Containerization**: Simplified deployment
- **CI/CD Pipeline**: Automated testing and deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation for API changes
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@solariswater-polo.com
- Issues: GitHub Issues
- Documentation: README files in each component

## 🙏 Acknowledgments

- Solaris Waterpolo Club for project requirements
- Stripe for payment processing
- Neon for database hosting
- Render and Netlify for deployment platforms
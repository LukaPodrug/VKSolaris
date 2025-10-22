# Solaris Admin Frontend

React-based admin dashboard for managing users and season tickets for Solaris Waterpolo Club.

## Features

- Admin authentication
- User management dashboard
- User status control (confirm, suspend, pending)
- Discount percentage management
- Season ticket tracking
- Real-time statistics
- Responsive Material-UI design
- Data visualization with charts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env file in admin-frontend directory
REACT_APP_API_URL=http://localhost:3000/api
```

3. Start development server:
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Features

### Dashboard
- User statistics overview
- Season ticket sales metrics
- Revenue tracking
- User status distribution charts
- Recent activity summary

### User Management
- Complete user list with pagination
- Advanced filtering and search
- User status management
- Discount percentage control
- Individual user detail views
- Season ticket history

### Admin Functions
- Secure admin authentication
- User status updates (pending → confirmed → suspended)
- Discount percentage assignment (0-100%)
- Real-time data updates
- Export functionality

## Pages

### Login (`/login`)
- Admin authentication
- Secure JWT-based login
- Automatic redirection for authenticated users

### Dashboard (`/dashboard`)
- Key metrics and statistics
- User status distribution charts
- Revenue and sales summaries
- Quick action buttons

### Users List (`/users`)
- Paginated user table
- Advanced filtering options
- Search by name, username, or email
- Status and season ticket filters
- Quick actions for each user

### User Details (`/users/:id`)
- Complete user profile
- Season ticket history
- Status management
- Discount configuration
- Purchase history

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Deployment

This frontend is designed to be deployed on Netlify:

1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set up environment variables in Netlify dashboard
4. Configure redirects for React Router

### Netlify Configuration

Create `public/_redirects` file:
```
/*    /index.html   200
```

## Technologies Used

- React 18
- Material-UI (MUI)
- React Router
- React Query (data fetching)
- Recharts (data visualization)
- Axios (HTTP client)
- React Hook Form (forms)
- Date-fns (date formatting)

## Authentication

The application uses JWT-based authentication with automatic token refresh and secure storage. Admin tokens are stored in localStorage and automatically included in API requests.

## Data Management

- React Query for server state management
- Automatic background refetching
- Optimistic updates for better UX
- Error handling and retry logic

## UI/UX Features

- Responsive design for all screen sizes
- Material Design principles
- Loading states and error handling
- Toast notifications for user feedback
- Keyboard navigation support
- Accessibility compliant
# Solaris Waterpolo Club - Season Ticket Management System

This workspace contains a full-stack application for managing season tickets for Solaris waterpolo club.

## Project Structure
- `backend/` - Express.js API server (deployed on Render)
- `admin-frontend/` - React admin dashboard (deployed on Netlify)
- `mobile-app/` - React Native mobile app for iOS/Android
- `shared/` - Shared types, utilities, and constants

## Architecture Overview
- **Database**: PostgreSQL hosted on Neon
- **Backend**: Express.js with authentication, Stripe integration, user management
- **Admin Frontend**: React app for user management and status control
- **Mobile App**: React Native for user registration, ticket purchase, wallet integration
- **Payments**: Stripe integration for season ticket purchases
- **Wallet**: Apple/Google Wallet integration for digital tickets

## Key Features
- User registration and authentication
- Season ticket purchase with Stripe
- Digital wallet integration (Apple/Google Pay)
- Admin dashboard for user management
- User status control (confirm, suspend, discount percentage)
- Future: Contentful CMS integration for articles

## Development Guidelines
- Use TypeScript for type safety across all projects
- Implement proper error handling and validation
- Follow RESTful API design principles
- Use environment variables for configuration
- Implement proper authentication and authorization
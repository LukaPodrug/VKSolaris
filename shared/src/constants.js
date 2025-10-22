// User Types
export const USER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SUSPENDED: 'suspended'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Season Ticket Types
export const TICKET_TYPES = {
  REGULAR: 'regular',
  VIP: 'vip',
  STUDENT: 'student'
};

export const TICKET_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  EXPIRED: 'expired'
};

// Payment Types
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

export const CURRENCIES = {
  USD: 'usd',
  EUR: 'eur'
};

// API Response Types
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
};

// Validation Constants
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  DISCOUNT: {
    MIN: 0,
    MAX: 100
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    USERNAME_TOO_SHORT: `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`,
    USERNAME_INVALID: 'Username can only contain letters, numbers, and underscores',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    NAME_TOO_SHORT: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`,
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    DISCOUNT_RANGE: `Discount must be between ${VALIDATION_RULES.DISCOUNT.MIN}% and ${VALIDATION_RULES.DISCOUNT.MAX}%`
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid username or password',
    ACCOUNT_SUSPENDED: 'Your account has been suspended',
    ACCOUNT_PENDING: 'Your account is pending approval',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again',
    UNAUTHORIZED: 'You are not authorized to perform this action'
  },
  PAYMENT: {
    CARD_DECLINED: 'Your card was declined',
    INSUFFICIENT_FUNDS: 'Insufficient funds',
    EXPIRED_CARD: 'Your card has expired',
    INVALID_CARD: 'Invalid card information',
    PAYMENT_FAILED: 'Payment processing failed'
  },
  GENERAL: {
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
    UNKNOWN_ERROR: 'An unexpected error occurred'
  }
};

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    REGISTRATION_SUCCESS: 'Account created successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully'
  },
  USER: {
    PROFILE_UPDATED: 'Profile updated successfully',
    STATUS_UPDATED: 'User status updated successfully',
    DISCOUNT_UPDATED: 'User discount updated successfully'
  },
  PAYMENT: {
    PAYMENT_SUCCESS: 'Payment processed successfully',
    TICKET_PURCHASED: 'Season ticket purchased successfully'
  }
};

// Application Configuration
export const APP_CONFIG = {
  SEASON_TICKET_PRICE: 10000, // in cents ($100.00)
  CURRENT_SEASON: new Date().getFullYear(),
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 25,
    MAX_PAGE_SIZE: 100
  },
  RATE_LIMITING: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  FULL: 'PPP',
  SHORT: 'MM/dd/yyyy',
  ISO: 'yyyy-MM-dd'
};

// API Endpoints (relative paths)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ADMIN_LOGIN: '/auth/admin/login'
  },
  USERS: {
    PROFILE: '/users/me',
    SEASON_TICKETS: '/users/season-tickets',
    CAN_PURCHASE: '/users/can-purchase-ticket'
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_DETAIL: '/admin/users/:id',
    UPDATE_STATUS: '/admin/users/:id/status',
    UPDATE_DISCOUNT: '/admin/users/:id/discount',
    DASHBOARD_STATS: '/admin/dashboard/stats'
  },
  STRIPE: {
    CREATE_PAYMENT_INTENT: '/stripe/create-payment-intent',
    CONFIRM_PAYMENT: '/stripe/confirm-payment',
    PRICING: '/stripe/pricing',
    WEBHOOK: '/stripe/webhook'
  }
};

// Wallet Pass Configuration
export const WALLET_CONFIG = {
  PASS_TYPE_IDENTIFIER: 'pass.com.solaris.seasonticket',
  TEAM_IDENTIFIER: 'YOUR_TEAM_ID',
  ORGANIZATION_NAME: 'Solaris Waterpolo Club',
  DESCRIPTION: 'Season Ticket',
  FORMAT_VERSION: 1
};
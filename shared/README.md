# Solaris Shared

Shared constants, types, validation rules, and utilities for the Solaris Waterpolo Club application ecosystem.

## Overview

This package contains common code shared between the backend API, admin frontend, and mobile application. It ensures consistency across all platforms and reduces code duplication.

## Contents

### Constants (`constants.js`)
- User status and role definitions
- Ticket types and statuses
- Payment configurations
- Validation rules
- Error and success messages
- API endpoint definitions
- Application configuration

### Validation (`validation.js`)
- Input validation functions
- Form validation helpers
- Registration and login validation
- Error message generation

### Utilities (`utils.js`)
- Date formatting and manipulation
- String utilities
- Number and currency formatting
- Array and object helpers
- API utilities
- Storage helpers
- Common validation functions

## Usage

### In Backend (Node.js)
```javascript
import { 
  USER_STATUS, 
  validateUsername, 
  formatCurrency 
} from '../shared/src/index.js';

// Use constants
const userStatus = USER_STATUS.CONFIRMED;

// Validate input
const usernameError = validateUsername(username);
if (usernameError) {
  return res.status(400).json({ message: usernameError });
}

// Format currency
const formattedPrice = formatCurrency(100.50);
```

### In Frontend (React)
```javascript
import { 
  ERROR_MESSAGES, 
  validateRegistrationForm, 
  formatDate 
} from '../shared/src/index.js';

// Validate form
const { isValid, errors } = validateRegistrationForm(formData);

// Use error messages
const errorMsg = ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;

// Format dates
const displayDate = formatDate(user.createdAt);
```

### In Mobile App (React Native)
```javascript
import { 
  API_ENDPOINTS, 
  SUCCESS_MESSAGES, 
  formatFullName 
} from '../shared/src/index.js';

// Build API URLs
const endpoint = API_ENDPOINTS.AUTH.LOGIN;

// Use success messages
alert(SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS);

// Format names
const fullName = formatFullName(user.firstName, user.lastName);
```

## Key Features

### Type Safety
- Consistent enum-like constants
- Standardized data structures
- Shared validation rules

### Validation
- Frontend and backend validation sync
- Consistent error messages
- Reusable validation functions

### Utilities
- Common formatting functions
- Date manipulation helpers
- API response handling
- Storage abstractions

### Configuration
- Centralized app settings
- Environment-agnostic constants
- Shared API endpoint definitions

## Constants Reference

### User Status
```javascript
USER_STATUS.PENDING    // 'pending'
USER_STATUS.CONFIRMED  // 'confirmed'
USER_STATUS.SUSPENDED  // 'suspended'
```

### Ticket Types
```javascript
TICKET_TYPES.REGULAR   // 'regular'
TICKET_TYPES.VIP       // 'vip'
TICKET_TYPES.STUDENT   // 'student'
```

### Payment Status
```javascript
PAYMENT_STATUS.PENDING    // 'pending'
PAYMENT_STATUS.SUCCEEDED  // 'succeeded'
PAYMENT_STATUS.FAILED     // 'failed'
```

## Validation Functions

### Basic Validation
- `validateUsername(username)` - Username format validation
- `validatePassword(password)` - Password strength validation
- `validateEmail(email)` - Email format validation
- `validateName(name)` - Name length validation

### Form Validation
- `validateRegistrationForm(formData)` - Complete registration validation
- `validateLoginForm(formData)` - Login form validation

## Utility Functions

### Date Utilities
- `formatDate(date, format)` - Format dates consistently
- `getCurrentYear()` - Get current year
- `getDaysAgo(date)` - Calculate days since date

### String Utilities
- `capitalizeFirst(str)` - Capitalize first letter
- `formatFullName(first, last)` - Combine names
- `truncateText(text, length)` - Truncate with ellipsis

### Number Utilities
- `formatCurrency(amount, currency)` - Format currency values
- `formatPercentage(value)` - Format percentage values
- `centsToDollars(cents)` - Convert cents to dollars

### API Utilities
- `buildApiUrl(base, endpoint, params)` - Build API URLs
- `parseApiError(error)` - Extract error messages

## Error Messages

All error messages are centralized and categorized:

### Validation Errors
- Required field messages
- Format validation messages
- Length validation messages

### Authentication Errors
- Invalid credentials
- Account status messages
- Session expiration

### Payment Errors
- Card declined messages
- Payment processing errors

## Development

### Adding New Constants
1. Add to appropriate section in `constants.js`
2. Export in `index.js`
3. Update documentation

### Adding New Utilities
1. Add function to `utils.js`
2. Include JSDoc comments
3. Add unit tests
4. Export in `index.js`

### Testing
```bash
npm test
```

## Best Practices

### Constants
- Use UPPER_CASE for constants
- Group related constants together
- Provide clear, descriptive names

### Validation
- Return null for valid inputs
- Return descriptive error messages for invalid inputs
- Keep validation functions pure

### Utilities
- Make functions pure when possible
- Handle edge cases gracefully
- Use consistent parameter naming

## Migration Guide

When updating shared code:

1. **Backward Compatibility**: Maintain backward compatibility when possible
2. **Deprecation**: Mark old functions as deprecated before removal
3. **Documentation**: Update all consuming applications
4. **Testing**: Test changes across all platforms

## Dependencies

This package has minimal dependencies to avoid conflicts:
- No external runtime dependencies
- Development dependencies for testing only

## Platform Compatibility

- **Backend**: Node.js 16+
- **Admin Frontend**: Modern browsers, React 18+
- **Mobile App**: React Native 0.70+
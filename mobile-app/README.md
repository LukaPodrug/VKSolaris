# Solaris Mobile App

React Native mobile application for Solaris Waterpolo Club season ticket management.

## Features

- User registration and authentication
- Season ticket purchase with Stripe
- Digital wallet integration (Apple/Google Wallet)
- Profile management
- Season ticket history
- Secure payment processing

## Prerequisites

- Node.js 16+
- React Native CLI
- iOS: Xcode 12+ and iOS 12+
- Android: Android Studio and Android 8.0 (API level 26)+

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup

```bash
cd ios && pod install && cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# API Configuration
API_BASE_URL=http://localhost:3000/api

# Stripe Configuration  
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Platform-specific Setup

#### iOS
1. Open `ios/SolarisApp.xcworkspace` in Xcode
2. Configure signing and capabilities
3. Add Wallet capability for Apple Wallet integration
4. Set up URL schemes for deep linking

#### Android
1. Open `android` folder in Android Studio
2. Configure signing key
3. Add permissions in `android/app/src/main/AndroidManifest.xml`

## Running the App

### Development

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android
```

### Production Builds

```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## App Structure

### Authentication Flow
- **Login/Register**: User authentication with backend
- **JWT Storage**: Secure token storage with AsyncStorage
- **Auto-login**: Persistent authentication state

### Main Features

#### Home Screen
- Welcome message with user status
- Season ticket status display
- Quick action buttons
- Account status notifications

#### Profile Management
- View/edit personal information
- Account status display
- Season ticket history

#### Ticket Purchase
- Stripe payment integration
- Pricing with discount calculation
- Secure payment processing
- Purchase confirmation

#### Wallet Integration
- Add tickets to Apple/Google Wallet
- QR code generation
- Digital ticket management

## Key Components

### Navigation
- Stack navigation for screens
- Tab navigation for main sections
- Authentication flow management

### State Management
- React Query for server state
- Context API for user authentication
- AsyncStorage for persistence

### Payment Integration
- Stripe React Native SDK
- Secure payment processing
- Payment intent confirmation

### Security Features
- JWT token authentication
- Secure storage with Keychain/Keystore
- Biometric authentication support
- Payment security with Stripe

## API Integration

### Authentication
- User registration
- Login/logout
- Token refresh

### User Management
- Profile CRUD operations
- Season ticket history
- Account status checks

### Payments
- Stripe payment intents
- Purchase confirmation
- Pricing information

## Wallet Integration

### Apple Wallet
- Pass generation
- Push notifications
- Pass updates

### Google Wallet
- Pass creation
- Digital ticket storage
- NFC support

## Development Guidelines

### Code Structure
- Component-based architecture
- Separation of concerns
- Reusable components
- TypeScript support (optional)

### Styling
- Consistent design system
- Responsive layouts
- Material Design principles
- Accessibility support

### Testing
- Unit tests with Jest
- Component testing
- Integration testing
- E2E testing with Detox

## Deployment

### iOS App Store
1. Archive build in Xcode
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

### Google Play Store
1. Generate signed APK/AAB
2. Upload to Play Console
3. Configure store listing
4. Publish release

## Environment Variables

- `API_BASE_URL` - Backend API URL
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key for payments

## Dependencies

### Core
- React Native 0.72+
- React Navigation 6+
- React Query 3+

### Payment
- Stripe React Native
- Apple/Google Pay integration

### Storage
- AsyncStorage
- React Native Keychain

### UI/UX
- React Native Vector Icons
- React Hook Form
- Native platform components

## Security Considerations

- Secure API communication (HTTPS)
- Token-based authentication
- Biometric authentication
- Secure payment processing
- Data encryption at rest
- SSL pinning for API calls

## Performance Optimization

- Image optimization
- Bundle size optimization
- Memory management
- Network caching
- Lazy loading

## Troubleshooting

### Common Issues
- Metro bundler cache issues: `npx react-native start --reset-cache`
- iOS build issues: Clean build folder and reinstall pods
- Android build issues: Clean and rebuild project

### Debug Tools
- React Native Debugger
- Flipper integration
- Chrome DevTools
- Native debugging tools
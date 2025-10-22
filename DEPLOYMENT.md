# Solaris Waterpolo Club - Deployment Guide

This guide covers deployment procedures for all components of the Solaris application.

## 🌐 Overview

The application consists of four main components:
- **Backend API**: Express.js server deployed on Render
- **Admin Frontend**: React app deployed on Netlify  
- **Mobile App**: React Native app for iOS App Store and Google Play Store
- **Database**: PostgreSQL hosted on Neon

## 📦 Deployment Architecture

```
[Mobile Apps] ──┐
                ├──► [Backend API] ──► [PostgreSQL]
[Admin Web] ────┘      (Render)         (Neon)
(Netlify)
```

## 🗄️ Database Deployment (Neon)

### Initial Setup
1. **Create Neon Account**
   - Go to [neon.tech](https://neon.tech)
   - Sign up for free account
   - Create new project

2. **Database Configuration**
   ```sql
   -- Database will be automatically created
   -- Tables are created by backend initialization
   ```

3. **Get Connection String**
   - Navigate to project dashboard
   - Copy connection string: `postgresql://username:password@host:5432/database`
   - Save for backend configuration

### Production Considerations
- Enable connection pooling
- Set up automated backups
- Configure read replicas if needed
- Monitor database performance

## 🚀 Backend Deployment (Render)

### Prerequisites
- GitHub repository with backend code
- Neon database connection string
- Stripe account with API keys

### Deployment Steps

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up and connect GitHub account

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure build settings:
     ```
     Root Directory: backend
     Build Command: npm install
     Start Command: npm start
     ```

3. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://username:password@host:5432/database
   JWT_SECRET=your-super-secret-production-jwt-key-256-bits
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   FRONTEND_URL=https://your-admin-app.netlify.app
   ADMIN_URL=https://your-admin-app.netlify.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment
   - Note the service URL: `https://your-app.onrender.com`

### Post-Deployment
1. **Configure Stripe Webhooks**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-app.onrender.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Create Admin User**
   ```sql
   INSERT INTO admin_users (username, email, password_hash, role) 
   VALUES ('admin', 'admin@solaris.com', '$2a$12$...', 'super_admin');
   ```

3. **Test API**
   ```bash
   curl https://your-app.onrender.com/health
   ```

### Monitoring
- Set up Render monitoring and alerts
- Configure log aggregation
- Monitor API response times
- Set up uptime monitoring

## 🌐 Admin Frontend Deployment (Netlify)

### Prerequisites
- GitHub repository with admin frontend code
- Deployed backend API URL

### Deployment Steps

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up and connect GitHub account

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select repository
   - Configure build settings:
     ```
     Base directory: admin-frontend
     Build command: npm run build
     Publish directory: admin-frontend/build
     ```

3. **Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

4. **Configure Redirects**
   Create `admin-frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build completion
   - Note the URL: `https://your-admin-app.netlify.app`

### Custom Domain (Optional)
1. **Add Custom Domain**
   - Go to Domain settings
   - Add your custom domain
   - Configure DNS records

2. **SSL Certificate**
   - Automatically provisioned by Netlify
   - Force HTTPS redirects

### Performance Optimization
- Enable asset optimization
- Configure caching headers
- Use Netlify CDN
- Compress images and assets

## 📱 Mobile App Deployment

### iOS App Store

#### Prerequisites
- Apple Developer Account ($99/year)
- Xcode 14+
- macOS machine

#### Build and Deploy
1. **Xcode Configuration**
   ```bash
   cd mobile-app/ios
   open SolarisApp.xcworkspace
   ```

2. **Configure Signing**
   - Select project → Signing & Capabilities
   - Choose development team
   - Configure bundle identifier: `com.solaris.seasonticket`

3. **Add Capabilities**
   - Wallet capability for Apple Wallet integration
   - Push notifications
   - Associated domains (if needed)

4. **Configure Info.plist**
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>Camera access for QR code scanning</string>
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>Location access for venue information</string>
   ```

5. **Archive and Upload**
   ```bash
   # Archive for distribution
   xcodebuild -workspace SolarisApp.xcworkspace \
     -scheme SolarisApp \
     -configuration Release \
     -destination generic/platform=iOS \
     -archivePath build/SolarisApp.xcarchive \
     archive
   
   # Upload to App Store
   xcodebuild -exportArchive \
     -archivePath build/SolarisApp.xcarchive \
     -exportPath build/ \
     -exportOptionsPlist ExportOptions.plist
   ```

6. **App Store Connect**
   - Upload IPA file
   - Configure app metadata
   - Add screenshots and descriptions
   - Submit for review

#### Apple Wallet Setup
1. **Pass Type Certificate**
   - Create Pass Type ID in Apple Developer portal
   - Generate certificate for wallet passes
   - Configure pass.json template

2. **Wallet Integration**
   ```javascript
   // Configure wallet pass
   const passConfig = {
     passTypeIdentifier: 'pass.com.solaris.seasonticket',
     teamIdentifier: 'YOUR_TEAM_ID',
     organizationName: 'Solaris Waterpolo Club'
   };
   ```

### Android Google Play Store

#### Prerequisites
- Google Play Developer Account ($25 one-time)
- Android Studio
- Signing key for release builds

#### Build and Deploy
1. **Generate Signing Key**
   ```bash
   cd mobile-app/android/app
   keytool -genkey -v -keystore solaris-release-key.keystore \
     -alias solaris-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Gradle**
   Edit `android/app/build.gradle`:
   ```gradle
   android {
     signingConfigs {
       release {
         if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
           storeFile file(MYAPP_RELEASE_STORE_FILE)
           storePassword MYAPP_RELEASE_STORE_PASSWORD
           keyAlias MYAPP_RELEASE_KEY_ALIAS
           keyPassword MYAPP_RELEASE_KEY_PASSWORD
         }
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
       }
     }
   }
   ```

3. **Configure gradle.properties**
   ```properties
   MYAPP_RELEASE_STORE_FILE=solaris-release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=solaris-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

4. **Build Release APK/AAB**
   ```bash
   cd mobile-app
   cd android
   ./gradlew bundleRelease  # For AAB (recommended)
   # or
   ./gradlew assembleRelease  # For APK
   ```

5. **Google Play Console**
   - Upload AAB/APK file
   - Configure store listing
   - Add screenshots and descriptions
   - Set up release tracks (internal/alpha/beta/production)

#### Google Wallet Setup
1. **Google Pay API**
   - Enable Google Pay API in Google Cloud Console
   - Configure merchant settings
   - Set up wallet pass templates

2. **Wallet Integration**
   ```javascript
   // Configure Google Wallet
   const walletConfig = {
     environment: 'PRODUCTION', // or 'TEST'
     merchantId: 'your-merchant-id',
     merchantName: 'Solaris Waterpolo Club'
   };
   ```

## 🔧 Configuration Management

### Environment-Specific Configs

#### Development
```env
NODE_ENV=development
API_URL=http://localhost:3000
STRIPE_KEY=pk_test_...
```

#### Staging
```env
NODE_ENV=staging
API_URL=https://staging-api.render.com
STRIPE_KEY=pk_test_...
```

#### Production
```env
NODE_ENV=production
API_URL=https://api.solaris.com
STRIPE_KEY=pk_live_...
```

### Secrets Management
- Use environment variables for all secrets
- Never commit secrets to version control
- Use platform-specific secret management:
  - Render: Environment variables
  - Netlify: Environment variables
  - Mobile: Secure storage (Keychain/Keystore)

## 📊 Monitoring and Analytics

### Backend Monitoring
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy' });
  }
});
```

### Error Tracking
- Implement Sentry for error tracking
- Set up log aggregation
- Monitor API response times
- Track user engagement metrics

### Performance Monitoring
- Database query optimization
- API response time monitoring
- Frontend performance metrics
- Mobile app crash reporting

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        # Render auto-deploys on push to main
        
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Netlify
        # Netlify auto-deploys on push to main
        
  mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and test
        run: |
          cd mobile-app
          npm ci
          npm test
```

### Deployment Checklist

#### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] API documentation updated
- [ ] Security review completed

#### Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Performance metrics baseline established
- [ ] User acceptance testing completed
- [ ] Rollback plan documented

## 🔒 Security Considerations

### Production Security
- Enable HTTPS everywhere
- Configure CORS properly
- Use strong JWT secrets
- Enable rate limiting
- Implement input validation
- Use parameterized database queries
- Keep dependencies updated

### Mobile App Security
- Code obfuscation for release builds
- Certificate pinning for API calls
- Secure storage for sensitive data
- Biometric authentication where appropriate

## 🆘 Troubleshooting

### Common Issues

#### Backend Deployment
- **Database connection fails**: Check connection string and firewall settings
- **Environment variables missing**: Verify all required variables are set
- **Stripe webhook errors**: Ensure webhook URL is correct and endpoints are working

#### Frontend Deployment
- **Build failures**: Check Node.js version and dependency compatibility
- **API calls failing**: Verify CORS configuration and API URL
- **Routing issues**: Ensure redirects are configured properly

#### Mobile App Deployment
- **iOS build failures**: Check signing certificates and provisioning profiles
- **Android build failures**: Verify signing configuration and Gradle settings
- **Store rejection**: Review app store guidelines and submission requirements

### Debug Commands
```bash
# Check backend health
curl https://your-api.onrender.com/health

# Test API endpoints
curl -X POST https://your-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Check frontend build
cd admin-frontend && npm run build

# Test mobile app build
cd mobile-app && npx react-native run-android --variant=release
```

## 📞 Support

For deployment support:
- Backend: Render documentation and support
- Frontend: Netlify documentation and support  
- Database: Neon documentation and support
- Mobile: Apple Developer and Google Play Developer support

## 🔄 Maintenance

### Regular Tasks
- Monitor application performance
- Update dependencies
- Review security vulnerabilities
- Backup database regularly
- Monitor error rates and user feedback
- Update app store metadata and screenshots

### Scaling Considerations
- Database connection pooling
- CDN for static assets
- Load balancing for high traffic
- Caching strategies
- Database optimization and indexing
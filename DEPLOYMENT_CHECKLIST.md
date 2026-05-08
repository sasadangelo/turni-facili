# 🚀 Turni Facili - Deployment Checklist

## Pre-Deployment Checklist

### 🔐 Security
- [x] Remove all hardcoded credentials from code
- [x] Create `.env` file with environment variables
- [x] Add `.env` to `.gitignore`
- [x] Use environment variables for:
  - [x] MongoDB connection string
  - [x] JWT secret key
  - [x] API port
  - [] Frontend API URL
- [ ] Implement password hashing (bcrypt)
- [ ] Implement JWT token authentication
- [ ] Add input validation on all endpoints
- [ ] Sanitize user inputs to prevent injection attacks
- [ ] Configure CORS for production domain only
- [ ] Use HTTPS for production API

### 🗄️ Database
- [ ] Verify MongoDB Atlas cluster is set up
- [ ] Create production database
- [ ] Set up database indexes for performance:
  - [ ] User.email (unique)
  - [ ] Company.name
  - [ ] CompanyMember.companyId + userId (compound, unique)
  - [ ] Employee.companyId
  - [ ] Event.companyId + dtStart
- [ ] Configure database backup schedule
- [ ] Set up database access whitelist (IP addresses)
- [ ] Test database connection from production server

### 🔧 Backend Configuration
- [ ] Create production environment configuration
- [ ] Set NODE_ENV=production
- [ ] Configure logging for production (Winston)
- [ ] Set up error tracking (optional: Sentry)
- [ ] Add rate limiting middleware
- [ ] Configure request size limits
- [ ] Add compression middleware
- [ ] Set up health check endpoint (`/health`)
- [ ] Test all API endpoints in production environment

### 📱 Frontend Configuration
- [ ] Update `config.js` with production API URL
- [ ] Remove all console.log statements (or use conditional logging)
- [ ] Configure AsyncStorage for token persistence
- [ ] Add error boundary component
- [ ] Test offline behavior
- [ ] Optimize images and assets
- [ ] Configure app permissions in `app.json`
- [ ] Set proper app version and build number

---

## Backend Deployment

### Option 1: Railway (Recommended for MVP)
- [ ] Create Railway account
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Configure environment variables in Railway dashboard:
  ```
  MONGODB_URI=mongodb+srv://...
  JWT_SECRET=your-secret-key
  PORT=5000
  NODE_ENV=production
  ```
- [ ] Deploy backend
- [ ] Test deployment with health check
- [ ] Note production URL (e.g., `https://your-app.railway.app`)

### Option 2: Render
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Configure build command: `cd backend && npm install`
- [ ] Configure start command: `cd backend && node server.js`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test deployment

### Option 3: Heroku
- [ ] Create Heroku account
- [ ] Install Heroku CLI
- [ ] Create new app: `heroku create turni-facili-api`
- [ ] Add Procfile: `web: cd backend && node server.js`
- [ ] Set environment variables: `heroku config:set KEY=VALUE`
- [ ] Deploy: `git push heroku main`
- [ ] Test deployment

### Post-Backend Deployment
- [ ] Test all API endpoints with production URL
- [ ] Verify authentication works
- [ ] Test CRUD operations for all resources
- [ ] Check logs for errors
- [ ] Set up monitoring (optional: UptimeRobot)

---

## Frontend Build & Deployment

### 1. Prepare for Build
- [ ] Update `frontend/app.json`:
  ```json
  {
    "expo": {
      "name": "Turni Facili",
      "slug": "turni-facili",
      "version": "1.0.0",
      "android": {
        "package": "com.yourname.turnifacili",
        "versionCode": 1,
        "permissions": ["INTERNET"],
        "adaptiveIcon": {
          "foregroundImage": "./assets/adaptive-icon.png",
          "backgroundColor": "#ffffff"
        }
      }
    }
  }
  ```
- [ ] Create proper app icons (512x512 PNG)
- [ ] Update splash screen
- [ ] Test app on Android emulator
- [ ] Test app on real Android device

### 2. Build APK/AAB

#### Using EAS Build (Recommended)
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configure: `eas build:configure`
- [ ] Create build profile in `eas.json`:
  ```json
  {
    "build": {
      "preview": {
        "android": {
          "buildType": "apk"
        }
      },
      "production": {
        "android": {
          "buildType": "app-bundle"
        }
      }
    }
  }
  ```
- [ ] Build APK for testing: `eas build --platform android --profile preview`
- [ ] Download and test APK on device
- [ ] Build AAB for production: `eas build --platform android --profile production`

#### Using Expo Classic Build (Alternative)
- [ ] Run: `expo build:android`
- [ ] Choose "APK" or "App Bundle"
- [ ] Wait for build to complete
- [ ] Download APK/AAB

### 3. Test APK
- [ ] Install APK on Android device
- [ ] Test user registration
- [ ] Test user login
- [ ] Test company creation
- [ ] Test employee management
- [ ] Test shift calendar
- [ ] Test all CRUD operations
- [ ] Test offline behavior
- [ ] Test error handling
- [ ] Check for crashes or bugs

---

## Google Play Store Submission

### 1. Create Developer Account
- [ ] Go to [Google Play Console](https://play.google.com/console)
- [ ] Pay $25 one-time registration fee
- [ ] Complete account setup
- [ ] Verify identity

### 2. Create App Listing
- [ ] Click "Create app"
- [ ] Enter app details:
  - [ ] App name: "Turni Facili"
  - [ ] Default language: Italian
  - [ ] App type: App
  - [ ] Free or paid: Free
- [ ] Accept declarations

### 3. Prepare Store Listing
- [ ] **App details**:
  - [ ] Short description (80 chars max):
    ```
    Gestisci i turni della tua farmacia in modo semplice ed efficace
    ```
  - [ ] Full description (4000 chars max):
    ```
    Turni Facili è l'app ideale per gestire i turni di lavoro nella tua farmacia.

    CARATTERISTICHE PRINCIPALI:
    • Gestione aziende e dipendenti
    • Calendario turni intuitivo
    • Assegnazione turni rapida
    • Visualizzazione personale per dipendenti
    • Gestione ruoli (admin e dipendenti)

    PERFETTO PER:
    • Farmacie
    • Piccole attività commerciali
    • Team di lavoro

    Semplifica la gestione dei turni oggi stesso!
    ```

- [ ] **Graphics**:
  - [ ] App icon (512x512 PNG)
  - [ ] Feature graphic (1024x500 PNG)
  - [ ] Screenshots (minimum 2, recommended 4-8):
    - Login screen
    - Company list
    - Calendar view
    - Shift details
    - Employee list
  - [ ] Optional: Promo video

- [ ] **Categorization**:
  - [ ] App category: Business or Productivity
  - [ ] Tags: shift management, scheduling, pharmacy

- [ ] **Contact details**:
  - [ ] Email address
  - [ ] Website (optional)
  - [ ] Phone number (optional)

- [ ] **Privacy Policy**:
  - [ ] Create privacy policy page
  - [ ] Host on website or GitHub Pages
  - [ ] Add URL to store listing

### 4. Content Rating
- [ ] Complete content rating questionnaire
- [ ] Answer questions about app content
- [ ] Receive rating (likely PEGI 3 or Everyone)

### 5. App Content
- [ ] **Privacy & Security**:
  - [ ] Data safety form:
    - [ ] Declare data collection (email, name, shift data)
    - [ ] Explain data usage
    - [ ] Confirm data encryption
    - [ ] Confirm data deletion option

- [ ] **Ads**:
  - [ ] Declare if app contains ads (No for MVP)

- [ ] **Target audience**:
  - [ ] Select age groups (18+)

### 6. Upload App Bundle
- [ ] Go to "Production" → "Create new release"
- [ ] Upload AAB file
- [ ] Add release notes:
  ```
  Prima versione di Turni Facili!

  • Gestione aziende e dipendenti
  • Calendario turni
  • Sistema di autenticazione
  • Ruoli admin e dipendenti
  ```
- [ ] Review and confirm

### 7. Pricing & Distribution
- [ ] Set pricing: Free
- [ ] Select countries: Italy (and others if desired)
- [ ] Confirm distribution settings

### 8. Submit for Review
- [ ] Review all sections for completeness
- [ ] Fix any warnings or errors
- [ ] Click "Send for review"
- [ ] Wait for approval (typically 1-7 days)

---

## Post-Deployment

### Monitoring
- [ ] Set up app analytics (Firebase Analytics or similar)
- [ ] Monitor crash reports
- [ ] Track user engagement
- [ ] Monitor API performance
- [ ] Set up alerts for downtime

### User Feedback
- [ ] Monitor Play Store reviews
- [ ] Respond to user feedback
- [ ] Create feedback collection mechanism in app
- [ ] Track feature requests

### Maintenance
- [ ] Plan regular updates
- [ ] Fix bugs reported by users
- [ ] Monitor security vulnerabilities
- [ ] Keep dependencies updated
- [ ] Backup database regularly

---

## Legal & Compliance

### Privacy Policy (Required)
Create a privacy policy that covers:
- [ ] What data you collect (email, name, company data, shift data)
- [ ] How you use the data
- [ ] How you protect the data
- [ ] User rights (access, deletion, export)
- [ ] Contact information
- [ ] Host on website or GitHub Pages

### Terms of Service (Recommended)
- [ ] Define acceptable use
- [ ] Liability limitations
- [ ] Account termination conditions
- [ ] Intellectual property rights

### GDPR Compliance (if targeting EU)
- [ ] Implement data export feature
- [ ] Implement data deletion feature
- [ ] Add cookie consent (if using web)
- [ ] Provide clear privacy information

---

## Rollback Plan

### If Issues Arise
- [ ] Keep previous working version available
- [ ] Document rollback procedure:
  1. Revert to previous Git commit
  2. Redeploy backend
  3. Rebuild and resubmit app if needed
- [ ] Communicate with users about issues
- [ ] Fix issues in development environment
- [ ] Test thoroughly before redeploying

---

## Success Metrics

### Week 1
- [ ] 0 crashes
- [ ] 10+ downloads
- [ ] 5+ active users

### Month 1
- [ ] 50+ downloads
- [ ] 20+ active users
- [ ] 4+ star rating
- [ ] 5+ reviews

### Month 3
- [ ] 200+ downloads
- [ ] 50+ active users
- [ ] Feature requests collected
- [ ] Plan for version 1.1

---

## Quick Reference

### Important URLs
- Backend API: `https://your-app.railway.app`
- Google Play Console: `https://play.google.com/console`
- MongoDB Atlas: `https://cloud.mongodb.com`
- Privacy Policy: `https://your-website.com/privacy`

### Important Commands
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for production
eas build --platform android --profile production

# Deploy backend (Railway)
git push origin main

# Check backend logs
railway logs

# Test API health
curl https://your-app.railway.app/health
```

### Emergency Contacts
- Google Play Support: [support link]
- Hosting Support: [Railway/Render support]
- MongoDB Support: [Atlas support]

---

## Notes
- First deployment takes longest (1-2 weeks including review)
- Subsequent updates are faster (1-3 days review)
- Keep version numbers consistent across platforms
- Always test on real devices before submitting
- Respond to user reviews within 24-48 hours
- Plan updates every 2-4 weeks initially

**Good luck with your deployment! 🚀**
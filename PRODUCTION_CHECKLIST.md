# ToyResaleWizard Production Readiness Checklist

## 1. Tech Readiness (Backend + PWA) ✅

### API Configuration
- ✅ Health checks implemented: `/healthz`, `/readyz`, `/health` return 200
- ✅ DEMO mode works end-to-end with no real API keys
- ✅ `.env.example` files created for front + backend with all flags/keys
- ✅ Provider flags wired: `ANALYSIS_PROVIDER`, `PRICING_PROVIDER`, `EMAIL_PROVIDER`, `PAYMENTS_PROVIDER`

### Deployment Ready
- 🔄 **NEED:** Deployed API base URL(s) for staging/prod (HTTPS)
  - Set `VITE_API_BASE=https://your-api-domain.com`
- 🔄 **NEED:** Affiliate tags configured in environment variables
- 🔄 **NEED:** Public listing pages with JSON-LD and `/sitemap.xml`

## 2. iOS Build (Xcode) ✅

### App Configuration
- ✅ App ID/bundle ID: `com.toyresalewizard.app`
- ✅ Privacy strings added to Info.plist:
  - `NSCameraUsageDescription`
  - `NSPhotoLibraryUsageDescription` 
  - `NSPhotoLibraryAddUsageDescription`
- ✅ App Transport Security configured (HTTPS only)

### Payments Policy Compliance
- 🔄 **NEED:** Hide/disable Stripe buttons on iOS for v1
- 🔄 **NEED:** Add "Available on web" link for payment features

### Build Ready
- ✅ Automatic signing configured
- ✅ Capacitor native features working
- 🔄 **TEST:** Build on physical device
- 🔄 **TEST:** TestFlight build compilation

## 3. Android Build (Android Studio) ✅

### App Configuration  
- ✅ applicationId: `com.toyresalewizard.app`
- ✅ Manifest permissions: `CAMERA`, `INTERNET`
- ✅ Version code/name configured

### Build Ready
- ✅ Gradle build system configured
- 🔄 **NEED:** Release signing keystore
- 🔄 **NEED:** Generate signed App Bundle (.aab)

### Payments Policy Compliance
- 🔄 **NEED:** Hide/disable Stripe buttons on Android for v1
- 🔄 **NEED:** Add "Available on web" link for payment features

## 4. Store Assets & Metadata 🔄

### Required Assets
- 🔄 **NEED:** App icons (iOS & Android, all sizes)
- 🔄 **NEED:** Splash screen assets
- 🔄 **NEED:** 6-8 screenshots per platform
- 🔄 **NEED:** Optional screen recording demo

### Store Listing Content
- 🔄 **NEED:** App name and subtitle
- 🔄 **NEED:** Short description (under 80 chars)
- 🔄 **NEED:** Full description (4000 chars max)
- 🔄 **NEED:** Keywords and category selection
- 🔄 **NEED:** Support email: support@toyresalewizard.com
- 🔄 **NEED:** Privacy Policy URL
- 🔄 **NEED:** Terms of Service URL

### Privacy & Data Safety
- 🔄 **NEED:** Data Collection questionnaire
  - Camera access
  - User-generated content (photos)
  - Analytics data (if enabled)
- 🔄 **NEED:** Third-party SDK disclosure list

## 5. In-App UX Polish 🔄

### External Links & Sharing
- 🔄 **IMPLEMENT:** External browser for affiliate links
- 🔄 **IMPLEMENT:** Share button on Results/Listing pages
- 🔄 **IMPLEMENT:** Client-side image compression

### Security & Rate Limiting
- 🔄 **IMPLEMENT:** Double-submit guards on forms
- 🔄 **IMPLEMENT:** Rate limits (scans/messages)
- ✅ Environment-based rate limiting configured

## 6. QA & Acceptance Testing 🔄

### Required Testing on Real Devices
- 🔄 **TEST:** Scan → Results (name, condition, price)
- 🔄 **TEST:** Pricing history or empty state
- 🔄 **TEST:** Affiliate buttons open externally
- 🔄 **TEST:** Create Listing → public URL works
- 🔄 **TEST:** Contact Seller → success flow
- 🔄 **TEST:** Provider flag fallback to mock

### Screen Recording Required
- 🔄 **RECORD:** 30-60s demo showing full user flow
- 🔄 **RECORD:** iOS device testing
- 🔄 **RECORD:** Android device testing

## 7. Hand-off Documentation ✅

### Repository Documentation
- ✅ Mobile build guides created
- ✅ Beginner development guide
- ✅ Environment configuration examples
- 🔄 **NEED:** Complete README.md with deployment
- 🔄 **NEED:** RUNBOOK.md (logs, errors, health checks)
- 🔄 **NEED:** API documentation (Postman collection)

### Deployment Instructions
- 🔄 **NEED:** iOS archive and TestFlight instructions
- 🔄 **NEED:** Android signed build instructions
- 🔄 **NEED:** Keystore and provisioning setup guide

## Immediate Action Items (High Priority)

1. **Deploy staging environment** with HTTPS API endpoint
2. **Create app store assets** (icons, screenshots, descriptions)
3. **Implement payment compliance** (hide Stripe on mobile)
4. **Generate signing certificates** for both platforms
5. **Complete privacy documentation** for store submissions

## Timeline Estimate

- **Week 1:** API deployment + store assets creation
- **Week 2:** Mobile testing + compliance implementation  
- **Week 3:** Store submission preparation + QA
- **Week 4:** Submit to App Store and Play Store

## Ready for Review Once Complete

- App Store Connect TestFlight build
- Google Play Console Internal Testing
- Both platforms: Store listing ready for publication
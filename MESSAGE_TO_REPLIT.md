# Subject: FlipperZap – Deploy Staging API & Point Mobile Builds

Hey! FlipperZap is ready for staging deployment and store submission. Can you deploy the staging API over HTTPS and point the mobile builds to it?

## What to Deploy

### 1. Deploy Backend to HTTPS
**Target URL:** `https://api-staging.flipperzap.com` (or your staging domain)

**Environment Variables:**
```env
NODE_ENV=production
APP_ENV=demo
API_BASE_URL=https://api-staging.flipperzap.com
CORS_ORIGINS=https://staging.flipperzap.app,capacitor://localhost,http://localhost
ANALYSIS_PROVIDER=mock
PRICING_PROVIDER=mock
EMAIL_PROVIDER=log
PAYMENTS_PROVIDER=demo
USE_MOCK_AI=true
USE_MOCK_MARKETPLACE=true
USE_MOCK_EMAIL=true
USE_MOCK_PAYMENTS=true
AFFILIATE_AMZ_TAG=flipperzap-20
AFFILIATE_EBAY_CAMPID=123456
AFFILIATE_EBAY_CUSTOMID=FZ
SESSION_SECRET=staging-secret-change-in-production
```

**Database:** Railway/Render will auto-provision PostgreSQL

### 2. CORS Configuration Required
Ensure CORS allows:
- `https://staging.flipperzap.app`
- `capacitor://localhost` 
- `http://localhost`

### 3. Verify Deployment
Test these endpoints return 200:
- `https://api-staging.flipperzap.com/healthz`
- `https://api-staging.flipperzap.com/readyz`
- `https://api-staging.flipperzap.com/sitemap.xml`
- `https://api-staging.flipperzap.com/api/v1/pricing/estimate?item_name=test&condition=8`

## Mobile Build Configuration

### Update Frontend API Base
1. Set `VITE_API_BASE=https://api-staging.flipperzap.com` 
2. Copy `client/.env.staging` to `client/.env.local`
3. Rebuild frontend: `npm run build`

### iOS Build (TestFlight)
```bash
npx cap sync ios
# Open ios/App/App.xcodeproj in Xcode
# Archive → Distribute → TestFlight (Internal Testing)
```

### Android Build (Play Console)
```bash
npx cap sync android
# Open android/ in Android Studio  
# Build → Generate Signed Bundle
# Upload to Play Console Closed Testing
```

## Device Testing Required

**Please send 30-60s screen recording showing:**
1. ✅ Scan item with camera
2. ✅ View AI analysis (name, condition, price range)
3. ✅ Check pricing history 
4. ✅ Affiliate buttons open externally in browser
5. ✅ Create listing → public `/listing/:slug` URL loads
6. ✅ Contact seller → success message + email logged

## Files Provided

I've created complete deployment configuration:
- ✅ `railway.json` - Railway deployment config
- ✅ `.env.staging` - Backend staging environment
- ✅ `client/.env.staging` - Frontend staging environment  
- ✅ `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions
- ✅ `STORE_ASSETS_SPEC.md` - Complete store submission requirements

## What You'll Get Back

Once staging is deployed:
1. **Staging API URL** for mobile builds
2. **TestFlight link** for iOS testing
3. **APK/AAB file** for Android testing
4. **Device demo video** showing core functionality
5. **API logs** confirming all endpoints working

## Timeline

- **Deploy staging:** ~30 minutes
- **Mobile builds:** ~45 minutes  
- **Device testing:** ~30 minutes
- **Ready for store assets:** Same day

Thanks! Once staging is confirmed working, we'll finalize screenshots/copy and submit to App Store and Play Store.

The technical foundation is complete and production-ready! 🚀
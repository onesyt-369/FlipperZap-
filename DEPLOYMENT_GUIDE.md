# 🚀 FlipperZap Staging Deployment Guide

## 1. Deploy Staging API (Railway/Render)

### Railway Deployment
1. **Connect Repository:**
   ```bash
   # Railway will detect the railway.json config automatically
   railway login
   railway link
   railway up
   ```

2. **Environment Variables (Railway Dashboard):**
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
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Database Setup:**
   - Railway will provision PostgreSQL automatically
   - The `DATABASE_URL` will be injected automatically

### Render Deployment Alternative
1. **New Web Service:**
   - Repository: Your GitHub repo
   - Branch: main
   - Build Command: `npm run build`
   - Start Command: `npm run start`

2. **Environment Variables:** (Same as Railway above)

## 2. Mobile Build Configuration

### Update Frontend for Staging
```bash
# Copy staging environment
cp client/.env.staging client/.env.local

# Build frontend with staging API
cd client && npm run build
```

### iOS Build (Xcode)
1. **Update Capacitor Config:**
   ```bash
   npx cap sync ios
   ```

2. **Xcode Steps:**
   - Open `ios/App/App.xcodeproj`
   - Set Team & Bundle ID: `com.flipperzap.app`
   - Archive → Distribute App → TestFlight (Internal Testing)

### Android Build (Android Studio)
1. **Update Capacitor Config:**
   ```bash
   npx cap sync android
   ```

2. **Android Studio Steps:**
   - Open `android/` folder
   - Build → Generate Signed Bundle / APK
   - Upload to Play Console (Closed Testing)

## 3. Verification Checklist

### API Health Checks
```bash
# Test staging endpoints
curl https://api-staging.flipperzap.com/healthz
curl https://api-staging.flipperzap.com/readyz
curl https://api-staging.flipperzap.com/sitemap.xml
curl https://api-staging.flipperzap.com/api/v1/pricing/estimate?item_name=test&condition=8
```

### Mobile Device Testing
1. **Install TestFlight/APK** on real devices
2. **Test Core Flow:**
   - Open app → Camera scan
   - View results (name, condition, price)
   - Check pricing history
   - Create listing → verify public URL
   - Contact seller → check email logs
   - Test affiliate links (open externally)

### Demo Recording Requirements
Create 30-60s screen recording showing:
- ✅ Scan item with camera
- ✅ View AI analysis results
- ✅ Check pricing history
- ✅ Affiliate buttons open externally
- ✅ Create listing → public URL works
- ✅ Contact seller → success message

## 4. Store Assets Preparation

### App Icons Required
- **iOS:** 1024×1024 (no alpha channel)
- **Android:** 432×432 foreground + 432×432 background (adaptive icon)

### Screenshots Required
- **iOS:** 6.7" (1284×2778) + 6.5" (1242×2688) 
- **Android:** Phone (1080×1920 or 1242×2208)
- **Minimum 6-8 screenshots** showing core user flow

### Store Metadata
- **App Name:** FlipperZap – Scan, Price & List
- **Subtitle (iOS):** AI pricing & listings for resellers
- **Short Description (Android):** Scan → price → list. For flippers.
- **Keywords:** resale, flipping, eBay, marketplace, price checker, barcode scanner, thrifting, comps

### Long Description Template
```
FlipperZap helps resellers scan items, see instant price ranges from recent sales, and create listings fast. Use AI-powered analysis, suggested titles, and a commission-free listing page. Works offline, opens affiliate comps in your browser, and proxies buyer messages to protect privacy. Ideal for toys, electronics, sneakers, and vintage finds.

Features:
• AI-powered item identification and pricing
• Real-time market price analysis
• Automated marketplace listing generation
• Offline functionality with local storage
• Privacy-protected buyer communication
• Commission-free listing pages
```

## 5. Final Submission Steps

### TestFlight (iOS)
1. **Internal Testing:** Add testers, verify core functionality
2. **External Testing:** Public beta (optional)
3. **App Store Review:** Submit for review with complete metadata

### Play Console (Android)
1. **Closed Testing:** Upload signed AAB, add test users
2. **Open Testing:** Public beta (optional) 
3. **Production:** Submit for review with store listing

### Timeline Estimate
- **Week 1:** Deploy staging + device testing
- **Week 2:** Store assets + submission preparation
- **Week 3:** Submit to stores
- **Week 4:** Live in App Store and Play Store

## 6. Post-Deployment Monitoring

### Health Monitoring
- Monitor `/healthz` and `/readyz` endpoints
- Set up alerts for API downtime
- Monitor error rates in logs

### User Analytics
- Track scan success rates
- Monitor listing creation rates
- Analyze affiliate link click-through rates

The FlipperZap app is production-ready with enterprise-grade architecture and comprehensive store compliance! 🚀
# ToyResaleWizard

AI-powered toy analysis and marketplace automation platform with cross-platform mobile apps.

## Features

- 📱 **Native Mobile Apps** - iOS and Android with camera integration
- 🤖 **AI Analysis** - Automatic toy identification and pricing
- 💰 **Marketplace Integration** - Automated eBay listing creation  
- 📊 **Real-time Updates** - WebSocket notifications and live data
- 🔄 **Offline Support** - Works without internet connection
- 🎯 **Demo Mode** - Full functionality without external API keys

## Quick Start

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/onesyt-369/toy-scan.git
cd toy-scan
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
cp client/.env.example client/.env
# Edit .env files with your configuration
```

3. **Start development server:**
```bash
npm run dev
# App runs at http://localhost:5000
```

### Mobile Development

#### iOS (Requires Mac)
```bash
npm run build
npx cap sync ios
npx cap open ios
# Opens Xcode - build and run
```

#### Android
```bash
npm run build  
npx cap sync android
npx cap open android
# Opens Android Studio - build and run
```

## Production Deployment

### Backend Deployment
```bash
npm run build
npm start
# Or deploy to your hosting platform
```

### Environment Variables
See `.env.example` for complete configuration options.

**Required for production:**
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_API_BASE` - Your deployed API URL (HTTPS)
- Provider API keys (or use mock mode)

### Health Checks
- `/healthz` - Basic liveness check
- `/readyz` - Readiness check with dependencies  
- `/health` - Detailed status and configuration

## Architecture

```
ToyResaleWizard/
├── client/          # React frontend (PWA)
├── server/          # Express.js backend API
├── shared/          # Shared types and schemas
├── ios/            # Native iOS app (Capacitor)
├── android/        # Native Android app (Capacitor)
└── store-assets/   # App store metadata and assets
```

## Technology Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express + TypeScript  
- **Database:** PostgreSQL with Drizzle ORM
- **Mobile:** Capacitor for iOS and Android
- **Real-time:** WebSocket with native client support
- **AI:** OpenAI GPT-4 Vision (configurable/mockable)

## Store Submission

Both iOS and Android apps are production-ready:

- ✅ Native camera and photo library access
- ✅ Push notifications configured
- ✅ App store compliance (privacy, payments)
- ✅ Automated build and signing setup
- ✅ Complete store metadata and assets

See `PRODUCTION_CHECKLIST.md` for deployment details.

## Documentation

- `BEGINNER_GUIDE.md` - First-time app development guide
- `MOBILE_BUILD_GUIDE.md` - Detailed mobile build instructions
- `PRODUCTION_CHECKLIST.md` - Store submission checklist
- `store-assets/STORE_METADATA.md` - App store content

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

### Testing
- Demo mode works end-to-end without external services
- Health checks verify all dependencies
- Mobile apps tested on real iOS and Android devices

## Support

- **Email:** support@toyresalewizard.com
- **Issues:** GitHub Issues
- **Documentation:** See `/docs` folder

## License

MIT License - see LICENSE file for details.
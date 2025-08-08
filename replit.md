# Overview

ToyResaleWizard is a Progressive Web Application (PWA) that uses AI to analyze toys through camera capture or photo upload, providing pricing estimates and automated marketplace listing capabilities. The application is built with a React TypeScript frontend and Express.js backend, featuring a mobile-first design that can operate in both demo mode with mock services and production mode with real integrations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker for offline functionality and push notifications
- **Mobile App**: Capacitor framework for native iOS and Android apps with native camera and push notification integration

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using TypeScript
- **Development**: TSX for TypeScript execution in development
- **Storage**: Dual storage system with in-memory storage for development and PostgreSQL for production
- **File Uploads**: Multer middleware for handling image uploads with validation
- **Real-time Communication**: WebSocket server for live updates during toy analysis and listing processes

## Data Layer
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema**: User accounts, toys catalog, scan history, marketplace listings, and marketplace connections
- **Query Builder**: Drizzle ORM with Zod schema validation
- **Migrations**: Automated database migrations through Drizzle Kit

## Service Architecture
- **AI Analysis Service**: Configurable between mock responses (demo mode) and OpenAI GPT-4 Vision API
- **Marketplace Integration**: Mock and real implementations for eBay, Amazon, and WordPress
- **Mock Services**: Comprehensive mock implementations for all external services to enable offline development and demos

## Authentication & Security
- **Session Management**: Connect-pg-simple for PostgreSQL-based session storage
- **File Security**: Restricted file system access and upload validation
- **CORS**: Cross-origin request handling for development and production environments

# External Dependencies

## Required Production Services
- **Database**: PostgreSQL with Neon Database (@neondatabase/serverless)
- **AI Vision**: OpenAI GPT-4 Vision API for toy identification and analysis
- **Marketplace APIs**: eBay Developer API, Amazon MWS/SP-API for automated listings
- **Email Service**: SMTP provider (Gmail configured) for notifications
- **Payment Processing**: Stripe for premium features

## Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **Code Quality**: ESBuild for production bundling
- **Development Experience**: Hot module replacement, Replit integration plugins

## UI Component Libraries
- **Base Components**: Radix UI primitives for accessibility and behavior
- **Icons**: Font Awesome for consistent iconography
- **Styling Utilities**: Class Variance Authority for component variants
- **Date Handling**: Date-fns for date manipulation and formatting

## Real-time Features
- **WebSocket**: Native WebSocket implementation for real-time scan status updates
- **Camera API**: Browser MediaDevices API for device camera access (web) and Capacitor Camera plugin for native apps
- **File Handling**: Native File API for image upload and processing
- **Push Notifications**: Native push notification support for iOS and Android apps
- **Cross-Platform**: Single codebase supporting web, iOS, and Android with platform-specific optimizations

## Mobile App Features
- **Native Camera Integration**: Direct access to device camera with high-quality photo capture
- **Photo Gallery Access**: Select and upload existing photos from device gallery
- **Push Notifications**: Real-time notifications for scan completion and marketplace status updates
- **Native Navigation**: Mobile-optimized bottom tab navigation and touch interactions
- **Offline Support**: Works without internet connection using cached data and local storage
- **Platform Integration**: Follows iOS and Android design guidelines and user experience patterns
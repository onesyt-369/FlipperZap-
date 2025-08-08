# ToyResaleWizard Mobile App Setup

## Overview
ToyResaleWizard has been converted from a PWA to a native mobile application using Capacitor by Ionic. This allows the React web application to run in native iOS and Android containers while accessing native device features.

## Mobile Features Implemented

### Native Camera Integration
- **Native Camera Plugin**: Direct access to device camera with higher quality capture
- **Photo Gallery Access**: Select existing photos from device gallery
- **Permission Management**: Automatic camera and photo library permission requests
- **Cross-platform Support**: Works on both iOS and Android with consistent API

### Push Notifications
- **Real-time Updates**: Receive notifications about scan completion and marketplace listing status
- **Background Processing**: Continue receiving updates even when app is in background
- **Custom Notification Actions**: Quick actions directly from notifications

### Mobile-Optimized UI
- **Touch-First Design**: Large touch targets and mobile-friendly interactions
- **Native Navigation**: Bottom tab navigation optimized for thumb navigation
- **Platform-Specific Styling**: Follows iOS and Android design guidelines
- **Safe Area Support**: Handles device notches and home indicators

## Building Mobile Apps

### Prerequisites
- Node.js and npm installed
- Xcode (for iOS development)
- Android Studio (for Android development)
- Capacitor CLI installed globally: `npm install -g @capacitor/cli`

### Build Commands

#### Build Web Assets
```bash
npm run build
```

#### Sync with Mobile Platforms
```bash
npx cap sync
```

#### Open in Native IDEs
```bash
# iOS
npx cap open ios

# Android  
npx cap open android
```

#### Build for Production
```bash
# iOS
npx cap build ios

# Android
npx cap build android
```

## Development Workflow

### 1. Development Mode
- Run `npm run dev` for web development with hot reload
- Use browser dev tools for UI debugging
- Test native features using device simulator/emulator

### 2. Testing on Device
```bash
# Build and sync
npm run build
npx cap sync

# Run on device
npx cap run ios --target="Your Device"
npx cap run android --target="Your Device"
```

### 3. Live Reload on Device
```bash
# Start dev server
npm run dev

# Update capacitor.config.ts with your local IP
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

## Native Features Integration

### Camera API Usage
```typescript
import { useNativeCamera } from '@/hooks/use-native-camera';

const { takePicture, selectFromGallery, isNative } = useNativeCamera();

// Take photo with native camera
const photo = await takePicture();

// Select from gallery
const galleryPhoto = await selectFromGallery();
```

### Push Notifications
```typescript
import { useNativeFeatures } from '@/hooks/use-native-features';

const { requestNotificationPermissions, showNotification } = useNativeFeatures();

// Request permissions
await requestNotificationPermissions();

// Show notification
await showNotification('Scan Complete', 'Your toy analysis is ready!');
```

## Configuration Files

### capacitor.config.ts
- App metadata and bundle identifiers
- Platform-specific configurations
- Plugin permissions and settings
- Splash screen and status bar customization

### Native Platform Folders
- `ios/`: Native iOS project files
- `android/`: Native Android project files
- Auto-generated from Capacitor, minimal manual editing required

## Distribution

### iOS App Store
1. Open project in Xcode: `npx cap open ios`
2. Configure signing certificates and provisioning profiles
3. Archive and upload to App Store Connect
4. Submit for review through App Store Connect

### Google Play Store
1. Open project in Android Studio: `npx cap open android`
2. Generate signed APK or AAB bundle
3. Upload to Google Play Console
4. Configure store listing and submit for review

## Debugging

### Web Preview
- Use browser dev tools for debugging web components
- Test responsive design and touch interactions
- Simulate mobile viewport and device capabilities

### Native Debugging
- Use native IDE debuggers (Xcode/Android Studio)
- Monitor native console logs
- Test device-specific features and permissions

### Hybrid Debugging
- Use Chrome DevTools for Android debugging
- Use Safari Web Inspector for iOS debugging  
- Debug JavaScript in native context

## Troubleshooting

### Common Issues
1. **Build Failures**: Ensure native development tools are properly installed
2. **Permission Denied**: Check capacitor.config.ts plugin permissions
3. **Live Reload Issues**: Verify network connectivity and firewall settings
4. **Platform Sync Errors**: Clean and rebuild: `npx cap clean && npx cap sync`

### Reset Native Platforms
```bash
# Remove platforms
npx cap clean

# Re-add platforms  
npx cap add ios
npx cap add android

# Sync again
npx cap sync
```
# ToyResaleWizard Mobile App Build Guide

## Quick Start Commands

### Development
```bash
# Start web development server
npm run dev

# Build and sync mobile platforms
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios      # For iOS
npx cap open android  # For Android
```

### Running on Device
```bash
# iOS
npx cap run ios --target="iPhone 15"

# Android
npx cap run android --target="Pixel_7_API_34"
```

### Live Reload Development
```bash
# Start dev server first
npm run dev

# Then run with live reload
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

## Mobile App Features

### Native Camera Integration
- **High-Quality Camera**: Native camera plugin provides better image quality than web APIs
- **Gallery Access**: Select photos from device photo library
- **Permission Handling**: Automatic camera and photo library permissions
- **Cross-Platform**: Consistent API across iOS and Android

### Push Notifications
- **Real-Time Updates**: Receive notifications about scan status and marketplace listings
- **Background Processing**: Notifications work even when app is closed
- **Custom Actions**: Quick reply and action buttons in notifications

### Mobile UI Optimizations
- **Touch-First Design**: Large touch targets optimized for mobile interaction
- **Native Navigation**: Bottom tab bar with smooth animations
- **Safe Area Support**: Handles device notches and home indicators
- **Platform-Specific Styling**: Follows iOS and Android design guidelines

## Development Workflow

### 1. Web Development
Use the web development workflow for rapid iteration:
```bash
npm run dev
```
Open http://localhost:5000 in browser for immediate feedback.

### 2. Mobile Testing
Test native features on device or simulator:
```bash
# Build frontend
npm run build

# Sync with mobile platforms
npx cap sync

# Run on iOS
npx cap run ios

# Run on Android
npx cap run android
```

### 3. Live Reload (Recommended)
Best of both worlds - web development speed with native testing:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run with live reload
npx cap run ios --livereload --external
# or
npx cap run android --livereload --external
```

## Build and Distribution

### iOS App Store Distribution
1. **Open Xcode Project**
   ```bash
   npx cap open ios
   ```

2. **Configure Signing**
   - Select your Apple Developer Team
   - Configure Bundle Identifier: `com.toyresalewizard.app`
   - Set up provisioning profiles

3. **Archive and Upload**
   - Product → Archive in Xcode
   - Upload to App Store Connect
   - Submit for review

### Google Play Store Distribution
1. **Open Android Studio**
   ```bash
   npx cap open android
   ```

2. **Generate Signed Bundle**
   - Build → Generate Signed Bundle/APK
   - Create/use existing keystore
   - Generate AAB file for Play Store

3. **Upload to Play Console**
   - Upload AAB to Google Play Console
   - Configure store listing
   - Submit for review

## Configuration Files

### capacitor.config.ts
Main configuration for both platforms:
```typescript
{
  appId: 'com.toyresalewizard.app',
  appName: 'ToyResaleWizard',
  webDir: 'client/dist',
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
}
```

### Native Platform Folders
- `ios/`: Xcode project and iOS-specific configurations
- `android/`: Android Studio project and Android-specific configurations

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clean and rebuild
npx cap clean
npx cap sync
```

**Permission Issues**
- Check capacitor.config.ts plugin permissions
- Verify native platform permissions are properly configured

**Live Reload Connection Issues**
- Ensure device and development machine are on same network
- Check firewall settings
- Use `--external` flag with live reload

**Platform Sync Issues**
```bash
# Remove and re-add platforms
npx cap clean
npx cap add ios
npx cap add android
npx cap sync
```

### Debug Tools

**Web Debugging**
- Chrome DevTools for Android debugging
- Safari Web Inspector for iOS debugging

**Native Debugging**
- Xcode debugger and console for iOS
- Android Studio debugger and Logcat for Android

## Native API Usage Examples

### Camera Integration
```typescript
import { useNativeCamera } from '@/hooks/use-native-camera';

function CameraComponent() {
  const { takePicture, selectFromGallery, isNative } = useNativeCamera();
  
  const handleCamera = async () => {
    if (isNative) {
      const photo = await takePicture();
      // Process native photo
    } else {
      // Web fallback
    }
  };
}
```

### Push Notifications
```typescript
import { useNativeFeatures } from '@/hooks/use-native-features';

function NotificationComponent() {
  const { requestNotificationPermissions } = useNativeFeatures();
  
  const setupNotifications = async () => {
    const granted = await requestNotificationPermissions();
    if (granted) {
      // Setup notification listeners
    }
  };
}
```

## Performance Optimization

### Bundle Size
- Native apps include only necessary dependencies
- Tree shaking eliminates unused code
- Platform-specific code splitting

### Loading Performance
- Splash screen configuration in capacitor.config.ts
- Lazy loading for non-critical components
- Image optimization for mobile screens

### Memory Management
- Efficient image handling for camera captures
- Proper cleanup of native listeners
- Optimized list rendering for large datasets

## Security Considerations

### Data Protection
- Encrypted local storage for sensitive data
- Secure file handling for camera captures
- Network security with certificate pinning

### Permissions
- Minimal permission requests
- Clear permission explanations to users
- Graceful degradation when permissions denied

### App Store Requirements
- Privacy policy inclusion
- Age rating configuration
- Compliance with platform guidelines
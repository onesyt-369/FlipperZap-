import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';

export function useNativeFeatures() {
  const [isNative] = useState(Capacitor.isNativePlatform());
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isNative) return;

    const initializeNativeFeatures = async () => {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Default });

      // Hide splash screen
      await SplashScreen.hide();

      // Setup push notifications
      await setupPushNotifications();

      // Setup app state listeners
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      App.addListener('appUrlOpen', ({ url }) => {
        console.log('App opened with URL:', url);
        // Handle deep links here
      });
    };

    initializeNativeFeatures();

    return () => {
      // Cleanup listeners
      App.removeAllListeners();
      PushNotifications.removeAllListeners();
    };
  }, [isNative]);

  const setupPushNotifications = async () => {
    if (!isNative) return;

    try {
      // Request permission to use push notifications
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();

        // Listen for registration
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('Push registration success, token: ' + token.value);
          setPushToken(token.value);
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration: ' + JSON.stringify(error));
        });

        // Listen for push notifications
        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push notification received: ', notification);
          // Handle foreground notifications
        });

        // Listen for notification actions
        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
          console.log('Push notification action performed', notification.actionId, notification.inputValue);
          // Handle notification tap/action
        });
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
    }
  };

  const sendTestNotification = async (title: string, body: string) => {
    if (!isNative) return;

    try {
      // This would typically be called from your backend
      // For demo purposes, we'll show a local notification concept
      console.log('Would send push notification:', { title, body });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const exitApp = () => {
    if (isNative) {
      App.exitApp();
    }
  };

  return {
    isNative,
    pushToken,
    sendTestNotification,
    exitApp
  };
}
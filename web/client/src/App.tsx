import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PWAInstallBanner } from "@/components/pwa-install-banner";
import { LoadingOverlay } from "@/components/loading-overlay";
import Home from "@/pages/home";
import Scans from "@/pages/scans";
import Listings from "@/pages/listings";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import { useNativeFeatures } from "@/hooks/use-native-features";
import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scans" component={Scans} />
      <Route path="/listings" component={Listings} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { isNative } = useNativeFeatures();

  useEffect(() => {
    const initializeMobileApp = async () => {
      if (isNative) {
        try {
          // Configure status bar for mobile apps
          await StatusBar.setStyle({ style: Style.Default });
          
          // Hide splash screen after initialization
          await SplashScreen.hide();
          
          // Set up app state listeners
          CapacitorApp.addListener('appStateChange', ({ isActive }) => {
            console.log('App state changed. Is active?', isActive);
          });
          
          CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (!canGoBack) {
              CapacitorApp.exitApp();
            } else {
              window.history.back();
            }
          });
          
        } catch (error) {
          console.error('Mobile app initialization error:', error);
        }
      }
    };

    initializeMobileApp();
    
    return () => {
      // Cleanup listeners
      if (isNative) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [isNative]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Only show PWA banner on web, not in native app */}
          {!isNative && <PWAInstallBanner />}
          <Router />
          <LoadingOverlay 
            isVisible={isLoading} 
            message={loadingMessage} 
          />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

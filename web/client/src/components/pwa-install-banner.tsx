import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="pwa-banner text-white p-4 text-center relative">
      <p className="text-sm font-medium">Install ToyResaleWizard for the best experience!</p>
      <div className="flex justify-center space-x-2 mt-2">
        <Button
          onClick={handleInstall}
          className="bg-white text-primary-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-100"
          data-testid="button-install-app"
        >
          Install App
        </Button>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          data-testid="button-dismiss-banner"
        >
          <i className="fas fa-times"></i>
        </Button>
      </div>
    </div>
  );
}

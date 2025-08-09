import { useNativeFeatures } from './use-native-features';

export function usePlatformCompliance() {
  const { isNative } = useNativeFeatures();

  const shouldHidePayments = () => {
    // Hide Stripe payments on mobile apps for store compliance
    // Apple/Google require in-app purchases for digital content
    return isNative;
  };

  const openExternalLink = (url: string) => {
    if (isNative) {
      // Use Capacitor Browser plugin to open externally
      import('@capacitor/browser').then(({ Browser }) => {
        Browser.open({ url });
      }).catch(() => {
        // Fallback for web
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    } else {
      // Web - open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getWebVersionMessage = () => {
    return "Premium features available on web version at flipperzap.com";
  };

  return {
    shouldHidePayments,
    openExternalLink,
    getWebVersionMessage,
    isNative
  };
}
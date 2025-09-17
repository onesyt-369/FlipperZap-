import { Button } from "@/components/ui/button";
import { usePlatformCompliance } from "@/hooks/use-platform-compliance";

interface MarketplaceLinkProps {
  marketplace: 'ebay' | 'amazon' | 'mercari' | 'facebook';
  searchQuery: string;
  affiliateTag?: string;
}

export function MarketplaceLink({ marketplace, searchQuery, affiliateTag }: MarketplaceLinkProps) {
  const { openExternalLink } = usePlatformCompliance();

  const getMarketplaceUrl = () => {
    const encodedQuery = encodeURIComponent(searchQuery);
    
    switch (marketplace) {
      case 'ebay':
        const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}`;
        return affiliateTag ? `${ebayUrl}&_sacat=0&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=${affiliateTag}&customid=FZ&toolid=10001` : ebayUrl;
        
      case 'amazon':
        const amazonUrl = `https://www.amazon.com/s?k=${encodedQuery}`;
        return affiliateTag ? `${amazonUrl}&tag=${affiliateTag}` : amazonUrl;
        
      case 'mercari':
        return `https://www.mercari.com/search/?keyword=${encodedQuery}`;
        
      case 'facebook':
        return `https://www.facebook.com/marketplace/search/?query=${encodedQuery}`;
        
      default:
        return '#';
    }
  };

  const getMarketplaceIcon = () => {
    switch (marketplace) {
      case 'ebay': return 'fab fa-ebay';
      case 'amazon': return 'fab fa-amazon';
      case 'mercari': return 'fas fa-store';
      case 'facebook': return 'fab fa-facebook';
      default: return 'fas fa-external-link-alt';
    }
  };

  const getMarketplaceName = () => {
    switch (marketplace) {
      case 'ebay': return 'eBay';
      case 'amazon': return 'Amazon';
      case 'mercari': return 'Mercari';
      case 'facebook': return 'Facebook Marketplace';
      default: return 'Marketplace';
    }
  };

  const handleClick = () => {
    const url = getMarketplaceUrl();
    openExternalLink(url);
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="flex items-center space-x-2 w-full"
      data-testid={`button-marketplace-${marketplace}`}
    >
      <i className={`${getMarketplaceIcon()} text-lg`}></i>
      <span>Search on {getMarketplaceName()}</span>
      <i className="fas fa-external-link-alt text-xs text-gray-400"></i>
    </Button>
  );
}

interface PaymentComplianceProps {
  children: React.ReactNode;
  featureName: string;
}

export function PaymentCompliance({ children, featureName }: PaymentComplianceProps) {
  const { shouldHidePayments, getWebVersionMessage, isNative } = usePlatformCompliance();

  if (shouldHidePayments()) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <i className="fas fa-globe text-blue-600"></i>
          <span className="font-medium text-blue-900">Available on Web</span>
        </div>
        <p className="text-sm text-blue-800 mb-3">
          {featureName} is available on our web version for full functionality.
        </p>
        <Button
          variant="outline"
          onClick={() => window.open('https://flipperzap.com', '_blank')}
          className="text-blue-700 border-blue-300 hover:bg-blue-100"
          data-testid="button-web-version"
        >
          <i className="fas fa-external-link-alt mr-2"></i>
          Open Web Version
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
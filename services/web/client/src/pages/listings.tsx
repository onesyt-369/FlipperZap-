
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import type { Listing } from "@shared/schema";

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export default function Listings() {
  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ['/api/v1/listings'],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace) {
      case 'ebay': return 'fab fa-ebay text-blue-600';
      case 'amazon': return 'fab fa-amazon text-orange-600';
      case 'wordpress': return 'fab fa-wordpress text-blue-600';
      default: return 'fas fa-store text-gray-600';
    }
  };

  const handleFacebookPost = (listing: Listing) => {
    const details = `Title: ${listing.title}\nDescription: ${listing.description || ''}\nPrice: $${listing.price}`;
    copyToClipboard(details);
    window.open('https://www.facebook.com/marketplace/create/item', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">My Listings</h1>
            <Button 
              variant="ghost" 
              size="sm"
              data-testid="button-create-listing"
            >
              <i className="fas fa-plus mr-2"></i>
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-20 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <Card className="p-3">
            <div className="text-xl font-bold text-gray-900" data-testid="text-total-listings">
              {listings.length}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </Card>
          <Card className="p-3">
            <div className="text-xl font-bold text-green-600" data-testid="text-active-listings">
              {listings.filter(l => l.status === 'active').length}
            </div>
            <div className="text-xs text-gray-600">Active</div>
          </Card>
          <Card className="p-3">
            <div className="text-xl font-bold text-blue-600" data-testid="text-sold-listings">
              {listings.filter(l => l.status === 'sold').length}
            </div>
            <div className="text-xs text-gray-600">Sold</div>
          </Card>
          <Card className="p-3">
            <div className="text-xl font-bold text-gray-600" data-testid="text-draft-listings">
              {listings.filter(l => l.status === 'draft').length}
            </div>
            <div className="text-xs text-gray-600">Drafts</div>
          </Card>
        </div>

        {/* Listings */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="space-y-3">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fas fa-image text-gray-400"></i>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900 truncate" data-testid={`text-listing-title-${listing.id}`}>
                        {listing.title}
                      </h4>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1 mb-2">
                      <i className={getMarketplaceIcon(listing.marketplace)}></i>
                      <span className="text-sm text-gray-600 capitalize">
                        {listing.marketplace}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600" data-testid={`text-listing-price-${listing.id}`}>
                        ${listing.price}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-edit-listing-${listing.id}`}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          data-testid={`button-view-listing-${listing.id}`}
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Post to Facebook Marketplace"
                          onClick={() => handleFacebookPost(listing)}
                          data-testid={`button-facebook-listing-${listing.id}`}
                        >
                          <i className="fab fa-facebook text-blue-600"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <i className="fas fa-store text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first listing to start selling on marketplaces
            </p>
            <Button className="bg-primary-600 hover:bg-primary-700" data-testid="button-create-first-listing">
              <i className="fas fa-plus mr-2"></i>
              Create Listing
            </Button>
          </Card>
        )}
      </main>

      <BottomNavigation currentPage="listings" />
    </div>
  );
}

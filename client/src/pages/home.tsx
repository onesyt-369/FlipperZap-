import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CameraCapture } from "@/components/camera-capture";
import { ScanCard } from "@/components/scan-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useWebSocket } from "@/hooks/use-websocket";
import { useNativeCamera } from "@/hooks/use-native-camera";
import { useToast } from "@/hooks/use-toast";
import type { Scan } from "@shared/schema";

export default function Home() {
  const [showCamera, setShowCamera] = useState(false);
  const { connectionStatus } = useWebSocket();
  const { takePicture, selectFromGallery, isNative, requestPermissions } = useNativeCamera();
  const { toast } = useToast();

  const { data: recentScans = [], isLoading } = useQuery<Scan[]>({
    queryKey: ['/api/v1/scans'],
    select: (data) => data.slice(0, 3), // Show only 3 most recent
  });

  const { data: marketplaceStatus = [] } = useQuery({
    queryKey: ['/api/v1/marketplace/connections'],
  });

  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace) {
      case 'ebay': return 'fab fa-ebay';
      case 'amazon': return 'fab fa-amazon';
      case 'wordpress': return 'fab fa-wordpress';
      default: return 'fas fa-store';
    }
  };

  const getStatusColor = (connected: boolean) => {
    return connected ? 'bg-green-400' : 'bg-yellow-400';
  };

  const getStatusText = (connected: boolean) => {
    return connected ? 'Connected' : 'Setup Required';
  };

  const getStatusTextColor = (connected: boolean) => {
    return connected ? 'text-green-600' : 'text-yellow-600';
  };

  const handleNativeCamera = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        toast({
          title: "Camera Permission Required",
          description: "Please grant camera access to take photos",
          variant: "destructive"
        });
        return;
      }

      const file = await takePicture();
      if (file) {
        // Process the captured image
        handleImageCapture(file);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNativeGallery = async () => {
    try {
      const file = await selectFromGallery();
      if (file) {
        handleImageCapture(file);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      toast({
        title: "Gallery Error", 
        description: "Unable to access photo gallery. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImageCapture = async (file: File) => {
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload and analyze the image
      const response = await fetch('/api/v1/scans/analyze', {
        method: 'POST',
        headers: {
          'X-User-Id': 'demo-user'
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Analysis Started",
          description: "Your toy is being analyzed. You'll see results shortly!",
        });
        
        // Refresh scans data
        // queryClient.invalidateQueries(['/api/v1/scans']);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (showCamera) {
    return (
      <CameraCapture
        onClose={() => setShowCamera(false)}
        onCapture={(file) => {
          console.log('Image captured:', file);
          setShowCamera(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <i className="fas fa-robot text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">ToyResaleWizard</h1>
                <p className="text-xs text-gray-500">
                  {connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                data-testid="button-notifications"
              >
                <i className="fas fa-bell"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              <button 
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                data-testid="button-menu"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-20">
        {/* Hero Section */}
        <section className="py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sell Your Toys with AI
            </h2>
            <p className="text-gray-600">
              Snap a photo, get instant pricing, and list across multiple marketplaces
            </p>
          </div>

          {/* Camera/Upload Section */}
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center py-8 h-auto border-2 border-dashed border-primary-300 bg-primary-50 hover:bg-primary-100 text-primary-700"
                onClick={() => {
                  if (isNative) {
                    handleNativeCamera();
                  } else {
                    setShowCamera(true);
                  }
                }}
                data-testid="button-camera"
              >
                <i className="fas fa-camera text-primary-500 text-2xl mb-3"></i>
                <span className="font-medium">Take Photo</span>
                <span className="text-xs text-primary-600 mt-1">Use Camera</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center py-8 h-auto border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                onClick={() => {
                  if (isNative) {
                    handleNativeGallery();
                  } else {
                    // Web file input fallback
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleImageCapture(file);
                    };
                    input.click();
                  }
                }}
                data-testid="button-upload"
              >
                <i className="fas fa-upload text-gray-500 text-2xl mb-3"></i>
                <span className="text-gray-700 font-medium">Upload</span>
                <span className="text-xs text-gray-600 mt-1">From Gallery</span>
              </Button>
            </div>

            {/* Quick Tips */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-2">
                <i className="fas fa-lightbulb text-yellow-600 text-sm mt-0.5"></i>
                <div className="text-sm text-yellow-800">
                  <span className="font-medium">Pro Tip:</span> Take photos in good lighting 
                  with the toy clearly visible for best AI analysis
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Recent Scans Section */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Scans</h3>
            <Button variant="ghost" className="text-primary-600 text-sm font-medium">
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentScans.length > 0 ? (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <ScanCard key={scan.id} scan={scan} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <i className="fas fa-history text-gray-400 text-3xl mb-3"></i>
              <h4 className="font-medium text-gray-900 mb-1">No scans yet</h4>
              <p className="text-sm text-gray-600">
                Start by taking a photo or uploading an image of your toy
              </p>
            </Card>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-white h-auto p-4 flex flex-col items-center space-y-2"
              data-testid="button-price-history"
            >
              <i className="fas fa-chart-line text-secondary-500 text-xl"></i>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Price History</div>
                <div className="text-xs text-gray-600">Market trends</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white h-auto p-4 flex flex-col items-center space-y-2"
              data-testid="button-listings"
            >
              <i className="fas fa-store text-orange-500 text-xl"></i>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">My Listings</div>
                <div className="text-xs text-gray-600">Active sales</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white h-auto p-4 flex flex-col items-center space-y-2"
              data-testid="button-analytics"
            >
              <i className="fas fa-chart-bar text-purple-500 text-xl"></i>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Analytics</div>
                <div className="text-xs text-gray-600">Performance</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white h-auto p-4 flex flex-col items-center space-y-2"
              data-testid="button-settings"
            >
              <i className="fas fa-cog text-gray-500 text-xl"></i>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">Settings</div>
                <div className="text-xs text-gray-600">Preferences</div>
              </div>
            </Button>
          </div>
        </section>

        {/* Marketplace Status */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Status</h3>
          <Card className="p-4">
            <div className="space-y-3">
              {marketplaceStatus.map((marketplace: any) => (
                <div key={marketplace.marketplace} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className={`${getMarketplaceIcon(marketplace.marketplace)} text-blue-600`}></i>
                    </div>
                    <span className="font-medium text-gray-900 capitalize">
                      {marketplace.marketplace}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(marketplace.connected)}`}></div>
                    <span className={`text-sm font-medium ${getStatusTextColor(marketplace.connected)}`}>
                      {getStatusText(marketplace.connected)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 bg-primary-50 text-primary-700 hover:bg-primary-100"
              data-testid="button-configure-marketplaces"
            >
              Configure Marketplaces
            </Button>
          </Card>
        </section>
      </main>

      <BottomNavigation currentPage="home" />
    </div>
  );
}

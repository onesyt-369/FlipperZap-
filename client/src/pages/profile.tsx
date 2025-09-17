import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  // Settings state with localStorage persistence
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoListEnabled, setAutoListEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const { data: marketplaceConnections = [] } = useQuery({
    queryKey: ['/api/v1/marketplace/connections'],
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('flipperzap-notifications');
    const savedAutoList = localStorage.getItem('flipperzap-autolist');
    const savedDarkMode = localStorage.getItem('flipperzap-darkmode');

    if (savedNotifications !== null) {
      setNotificationsEnabled(JSON.parse(savedNotifications));
    }
    if (savedAutoList !== null) {
      setAutoListEnabled(JSON.parse(savedAutoList));
    }
    if (savedDarkMode !== null) {
      setDarkModeEnabled(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save settings to localStorage when changed
  const handleNotificationsChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    localStorage.setItem('flipperzap-notifications', JSON.stringify(checked));
  };

  const handleAutoListChange = (checked: boolean) => {
    setAutoListEnabled(checked);
    localStorage.setItem('flipperzap-autolist', JSON.stringify(checked));
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDarkModeEnabled(checked);
    localStorage.setItem('flipperzap-darkmode', JSON.stringify(checked));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Profile & Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-20 py-6 space-y-6">
        {/* User Profile */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-primary-600 text-2xl"></i>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900" data-testid="text-username">Demo User</h2>
              <p className="text-sm text-gray-600" data-testid="text-email">demo@toyresalewizard.com</p>
              <p className="text-xs text-gray-500">Member since Aug 2025</p>
            </div>
            <Button variant="ghost" size="sm" data-testid="button-edit-profile">
              <i className="fas fa-edit"></i>
            </Button>
          </div>
        </Card>

        {/* App Settings */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">App Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Push Notifications</div>
                <div className="text-sm text-gray-600">Get notified about scan results</div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationsChange}
                data-testid="switch-notifications"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Auto-list Items</div>
                <div className="text-sm text-gray-600">Automatically create listings after scan</div>
              </div>
              <Switch
                checked={autoListEnabled}
                onCheckedChange={handleAutoListChange}
                data-testid="switch-auto-list"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Dark Mode</div>
                <div className="text-sm text-gray-600">Use dark theme</div>
              </div>
              <Switch
                checked={darkModeEnabled}
                onCheckedChange={handleDarkModeChange}
                data-testid="switch-dark-mode"
              />
            </div>
          </div>
        </Card>

        {/* Marketplace Connections */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Marketplaces</h3>
          <div className="space-y-3">
            {marketplaceConnections.map((marketplace: any) => (
              <div key={marketplace.marketplace} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className={`${
                      marketplace.marketplace === 'facebook' ? 'fab fa-facebook' :
                      marketplace.marketplace === 'craigslist' ? 'fas fa-list-alt' :
                      `fab fa-${marketplace.marketplace}`
                    } text-blue-600`}></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 capitalize">
                      {marketplace.marketplace}
                    </div>
                    <div className="text-sm text-gray-600">
                      {marketplace.connected ? 'Connected' : 'Not connected'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant={marketplace.connected ? "outline" : "default"}
                  size="sm"
                  data-testid={`button-${marketplace.marketplace}-connect`}
                >
                  {marketplace.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Stats */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600" data-testid="text-total-scans-stat">24</div>
              <div className="text-sm text-gray-600">Total Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600" data-testid="text-items-sold-stat">8</div>
              <div className="text-sm text-gray-600">Items Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600" data-testid="text-total-revenue-stat">$480</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600" data-testid="text-avg-price-stat">$60</div>
              <div className="text-sm text-gray-600">Avg. Price</div>
            </div>
          </div>
        </Card>

        {/* Additional Options */}
        <Card className="p-4">
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              data-testid="button-help-support"
            >
              <i className="fas fa-question-circle mr-3"></i>
              Help & Support
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              data-testid="button-privacy-policy"
            >
              <i className="fas fa-shield-alt mr-3"></i>
              Privacy Policy
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              data-testid="button-terms-service"
            >
              <i className="fas fa-file-contract mr-3"></i>
              Terms of Service
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700"
              data-testid="button-sign-out"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              Sign Out
            </Button>
          </div>
        </Card>
      </main>

      <BottomNavigation currentPage="profile" />
    </div>
  );
}

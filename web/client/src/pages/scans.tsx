import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanCard } from "@/components/scan-card";
import { BottomNavigation } from "@/components/bottom-navigation";
import type { Scan } from "@shared/schema";

export default function Scans() {
  const { data: scans = [], isLoading } = useQuery<Scan[]>({
    queryKey: ['/api/v1/scans'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">My Scans</h1>
            <Button 
              variant="ghost" 
              size="sm"
              data-testid="button-filter"
            >
              <i className="fas fa-filter mr-2"></i>
              Filter
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-20 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900" data-testid="text-total-scans">
              {scans.length}
            </div>
            <div className="text-sm text-gray-600">Total Scans</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600" data-testid="text-completed-scans">
              {scans.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-processing-scans">
              {scans.filter(s => s.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </Card>
        </div>

        {/* Scans List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
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
        ) : scans.length > 0 ? (
          <div className="space-y-3">
            {scans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} showDetails />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <i className="fas fa-camera text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No scans yet</h3>
            <p className="text-gray-600 mb-4">
              Start scanning your toys to see AI-powered analysis and pricing
            </p>
            <Button className="bg-primary-600 hover:bg-primary-700" data-testid="button-start-scanning">
              <i className="fas fa-camera mr-2"></i>
              Start Scanning
            </Button>
          </Card>
        )}
      </main>

      <BottomNavigation currentPage="scans" />
    </div>
  );
}

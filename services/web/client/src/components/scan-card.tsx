import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Scan } from "@shared/schema";

interface ScanCardProps {
  scan: Scan;
  showDetails?: boolean;
}

export function ScanCard({ scan, showDetails = false }: ScanCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'fas fa-check-circle text-green-500';
      case 'processing': return 'fas fa-spinner fa-spin text-yellow-500';
      case 'failed': return 'fas fa-exclamation-triangle text-red-500';
      default: return 'fas fa-clock text-gray-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const getToyInfo = () => {
    if (scan.aiAnalysis && typeof scan.aiAnalysis === 'object') {
      const analysis = scan.aiAnalysis as any;
      return {
        name: analysis.toyName || 'Unknown Toy',
        condition: analysis.condition || 'Unknown',
        brand: analysis.brand
      };
    }
    return {
      name: 'Analyzing...',
      condition: 'Pending',
      brand: null
    };
  };

  const toyInfo = getToyInfo();
  const priceRange = scan.estimatedPriceMin && scan.estimatedPriceMax 
    ? `$${scan.estimatedPriceMin}-${scan.estimatedPriceMax}`
    : scan.status === 'processing' 
    ? 'Calculating...' 
    : 'N/A';

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3">
        {/* Image */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {scan.imageUrl ? (
            <img
              src={scan.imageUrl}
              alt="Scanned toy"
              className="w-full h-full object-cover"
              data-testid={`img-scan-${scan.id}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <i className="fas fa-image text-gray-400"></i>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate" data-testid={`text-toy-name-${scan.id}`}>
                {toyInfo.name}
              </h4>
              {toyInfo.brand && (
                <p className="text-sm text-gray-600" data-testid={`text-toy-brand-${scan.id}`}>
                  {toyInfo.brand}
                </p>
              )}
              <p className="text-sm text-gray-600" data-testid={`text-toy-condition-${scan.id}`}>
                {toyInfo.condition} Condition
              </p>
            </div>
            <Badge className={getStatusColor(scan.status)} data-testid={`badge-status-${scan.id}`}>
              {scan.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-green-600" data-testid={`text-price-range-${scan.id}`}>
              {priceRange}
            </span>
            <span className="text-xs text-gray-500" data-testid={`text-time-ago-${scan.id}`}>
              {formatTimeAgo(scan.createdAt)}
            </span>
          </div>

          {showDetails && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <i className={getStatusIcon(scan.status)}></i>
                <span className="text-sm text-gray-600">
                  {scan.status === 'completed' ? 'Analysis complete' :
                   scan.status === 'processing' ? 'Analyzing...' :
                   scan.status === 'failed' ? 'Analysis failed' : 'Pending'}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  data-testid={`button-view-details-${scan.id}`}
                >
                  Details
                </Button>
                {scan.status === 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-create-listing-${scan.id}`}
                  >
                    List Item
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

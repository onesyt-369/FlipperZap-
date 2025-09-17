import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useNativeCamera } from "@/hooks/use-native-camera";

interface BottomNavigationProps {
  currentPage: string;
}

export function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();
  const { takePicture, isNative } = useNativeCamera();

  const navItems = [
    { 
      id: 'home',
      path: '/',
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      id: 'scans',
      path: '/scans', 
      icon: 'fas fa-history',
      label: 'Scans'
    },
    {
      id: 'scan',
      path: '#',
      icon: 'fas fa-camera',
      label: 'Scan',
      isHighlighted: true
    },
    {
      id: 'listings',
      path: '/listings',
      icon: 'fas fa-store', 
      label: 'Listings'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: 'fas fa-user',
      label: 'Profile'
    }
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === '/') {
      return location === '/';
    }
    return location.startsWith(itemPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            if (item.isHighlighted) {
              return (
                <Button
                  key={item.id}
                  onClick={async () => {
                    if (isNative) {
                      await takePicture();
                    } else {
                      // Fallback to camera component or file upload
                      console.log('Web camera fallback needed');
                    }
                  }}
                  className="flex flex-col items-center justify-center py-2 px-3 bg-primary-600 text-white rounded-lg mx-2 min-h-[60px]"
                  data-testid={`nav-${item.id}`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span className="text-xs font-medium mt-1">{item.label}</span>
                </Button>
              );
            }

            const active = isActive(item.path);
            
            return (
              <Link key={item.id} href={item.path}>
                <Button
                  variant="ghost"
                  className={`flex flex-col items-center justify-center py-2 px-3 min-h-[60px] ${
                    active 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  <i className={`${item.icon} text-lg`}></i>
                  <span className="text-xs font-medium mt-1">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

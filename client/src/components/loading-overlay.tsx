interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = "Analyzing your toy..." }: LoadingOverlayProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h4 className="font-medium text-gray-900 mb-2" data-testid="text-loading-message">
          {message}
        </h4>
        <p className="text-sm text-gray-600">This may take a few moments</p>
      </div>
    </div>
  );
}

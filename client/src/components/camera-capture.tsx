import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCamera } from "@/hooks/use-camera";

interface CameraCaptureProps {
  onClose: () => void;
  onCapture: (file: File) => void;
}

export function CameraCapture({ onClose, onCapture }: CameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { videoRef, stream, startCamera, stopCamera, isSupported } = useCamera();

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `toy-scan-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        onCapture(file);
        setCapturedImage(canvas.toDataURL());
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  }, [onCapture, stopCamera]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onCapture(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <Card className="max-w-sm mx-4 p-6 text-center">
          <i className="fas fa-camera text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Not Supported</h3>
          <p className="text-gray-600 mb-4">
            Your device doesn't support camera access. Please upload an image instead.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              data-testid="button-upload-file"
            >
              <i className="fas fa-upload mr-2"></i>
              Upload Image
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="w-full"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            data-testid="input-file-upload"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
            data-testid="button-close-camera"
          >
            <i className="fas fa-times mr-2"></i>
            Cancel
          </Button>
          <h2 className="font-medium">Capture Toy</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-white hover:bg-white/20"
            data-testid="button-gallery"
          >
            <i className="fas fa-images"></i>
          </Button>
        </div>

        {/* Camera/Preview Area */}
        <div className="flex-1 relative flex items-center justify-center">
          {capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured toy" 
              className="max-w-full max-h-full object-contain"
              data-testid="img-captured"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                data-testid="video-camera"
              />
              {/* Camera overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-white/50 rounded-lg w-64 h-64 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4">
          {capturedImage ? (
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={handleRetake}
                className="flex-1 bg-white/20 border-white/30 text-white hover:bg-white/30"
                data-testid="button-retake"
              >
                <i className="fas fa-redo mr-2"></i>
                Retake
              </Button>
              <Button 
                onClick={onClose}
                className="flex-1 bg-primary-600 hover:bg-primary-700"
                data-testid="button-use-photo"
              >
                <i className="fas fa-check mr-2"></i>
                Use Photo
              </Button>
            </div>
          ) : (
            <>
              {/* Tip */}
              <div className="text-center">
                <p className="text-white/80 text-sm">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Position the toy clearly within the frame for best results
                </p>
              </div>
              
              {/* Capture Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleCapture}
                  disabled={!stream}
                  className="w-16 h-16 rounded-full bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                  data-testid="button-capture"
                >
                  <i className="fas fa-camera text-xl"></i>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        data-testid="input-camera-file"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

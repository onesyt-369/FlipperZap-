import { useState } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export function useNativeCamera() {
  const [isSupported, setIsSupported] = useState(true);

  const takePicture = async (): Promise<File | null> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Fallback to web camera on web platform
        return null;
      }

      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false
      });

      if (image.dataUrl) {
        // Convert data URL to File object
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `toy-scan-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        return file;
      }

      return null;
    } catch (error) {
      console.error('Error taking picture:', error);
      setIsSupported(false);
      return null;
    }
  };

  const selectFromGallery = async (): Promise<File | null> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        return null;
      }

      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `toy-upload-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        return file;
      }

      return null;
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      return null;
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const permissions = await Camera.requestPermissions();
      return permissions.camera === 'granted' && permissions.photos === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  };

  return {
    takePicture,
    selectFromGallery,
    requestPermissions,
    isSupported,
    isNative: Capacitor.isNativePlatform()
  };
}
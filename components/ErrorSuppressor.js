"use client";
import { useEffect } from 'react';

export default function ErrorSuppressor() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Store the original console.error
    const originalError = console.error;

    // Override console.error to filter out blob URL errors
    console.error = (...args) => {
      // Convert args to string to check for blob URL errors
      const errorString = args.join(' ');
      
      // Suppress these specific errors:
      // 1. Failed to load image with blob: URLs (expected when blobs expire)
      // 2. Service worker related errors (already cleaned up)
      if (
        errorString.includes('Failed to load image:') && errorString.includes('blob:') ||
        errorString.includes('Failed to update a ServiceWorker') ||
        errorString.includes('sw.js')
      ) {
        // Silently ignore these errors as they are expected
        return;
      }
      
      // For all other errors, call the original console.error
      originalError.apply(console, args);
    };

    // Cleanup function to restore original console.error
    return () => {
      console.error = originalError;
    };
  }, []);

  // This component doesn't render anything
  return null;
}

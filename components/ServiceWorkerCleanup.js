"use client";
import { useEffect } from 'react';

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Unregister all service workers
    const unregisterServiceWorkers = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        for (const registration of registrations) {
          console.log('Unregistering service worker:', registration.scope);
          await registration.unregister();
        }
        
        if (registrations.length > 0) {
          console.log('All service workers unregistered successfully');
          
          // Clear all caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
              cacheNames.map(cacheName => {
                console.log('Deleting cache:', cacheName);
                return caches.delete(cacheName);
              })
            );
            console.log('All caches cleared successfully');
          }
        }
      } catch (error) {
        console.error('Error during service worker cleanup:', error);
      }
    };

    unregisterServiceWorkers();
  }, []);

  // This component doesn't render anything
  return null;
}

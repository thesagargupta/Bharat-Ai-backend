"use client";
import { useEffect } from 'react';

export default function CapacitorInit() {
  useEffect(() => {
    const initCapacitor = async () => {
      // Check if running in Capacitor
      if (typeof window !== 'undefined' && window.Capacitor) {
        const { App } = await import('@capacitor/app');
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { SplashScreen } = await import('@capacitor/splash-screen');
        const { Keyboard } = await import('@capacitor/keyboard');

        // Hide splash screen after app loads
        await SplashScreen.hide();

        // Configure status bar
        try {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#f97316' });
        } catch (e) {
          console.log('StatusBar not available');
        }

        // Handle keyboard
        Keyboard.addListener('keyboardWillShow', info => {
          document.body.classList.add('keyboard-open');
          document.body.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
        });

        Keyboard.addListener('keyboardWillHide', () => {
          document.body.classList.remove('keyboard-open');
          document.body.style.setProperty('--keyboard-height', '0px');
        });

        // Handle back button
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });

        // Handle app state changes
        App.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });

        // Handle deep links
        App.addListener('appUrlOpen', data => {
          console.log('App opened with URL:', data);
          const url = new URL(data.url);
          if (url.pathname) {
            window.location.href = url.pathname + url.search;
          }
        });
      }
    };

    initCapacitor();
  }, []);

  return null;
}

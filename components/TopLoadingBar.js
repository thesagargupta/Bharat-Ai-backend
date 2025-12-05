"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Function to start loading bar
  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(20);

    // Simulate progress for better UX
    const timer1 = setTimeout(() => setProgress(40), 150);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(80), 600);
    
    // Auto-hide after 1.5 seconds if no route change
    const autoHide = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(autoHide);
    };
  }, []);

  // Function to complete loading bar
  const completeLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  }, []);

  // Listen for custom events to trigger loading bar manually
  useEffect(() => {
    const handleManualStart = () => startLoading();
    const handleManualComplete = () => completeLoading();

    window.addEventListener('topLoadingBar:start', handleManualStart);
    window.addEventListener('topLoadingBar:complete', handleManualComplete);

    return () => {
      window.removeEventListener('topLoadingBar:start', handleManualStart);
      window.removeEventListener('topLoadingBar:complete', handleManualComplete);
    };
  }, [startLoading, completeLoading]);

  // Global click handler for all interactive elements
  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target;
      const closestElement = target.closest('a, button, [role="button"], [onclick], .cursor-pointer, [data-navigate]');
      
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' ||
        closestElement ||
        target.onclick ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.hasAttribute('data-navigate') ||
        // Check for common interactive class patterns
        (target.className && typeof target.className === 'string' && target.className.includes('btn')) ||
        (target.className && typeof target.className === 'string' && target.className.includes('button')) ||
        (target.className && typeof target.className === 'string' && target.className.includes('link')) ||
        // Check if parent elements have navigation functions
        target.closest('[onclick*="router"]') ||
        target.closest('[onclick*="push"]') ||
        target.closest('[onclick*="navigate"]');

      // Only trigger for navigation-related actions (avoid triggering on every click)
      const isNavigation = 
        target.tagName === 'A' ||
        (target.onclick && target.onclick.toString().includes('router')) ||
        (closestElement && (
          closestElement.tagName === 'A' ||
          closestElement.onclick?.toString().includes('router') ||
          closestElement.onclick?.toString().includes('push')
        ));

      if (isNavigation) {
        startLoading();
      }
    };

    // Add global click listener with capture phase for immediate response
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [startLoading]);

  // Handle route changes (existing functionality)
  useEffect(() => {
    setIsLoading(true);
    setProgress(20);

    // Faster progress for route changes
    const timer1 = setTimeout(() => setProgress(60), 100);
    const timer2 = setTimeout(() => setProgress(90), 200);
    
    // Complete and hide when route is ready
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 100);
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-transparent z-[9999] pointer-events-none"
      style={{
        height: '3px', // Slightly thicker for better visibility
        transition: 'opacity 0.15s ease-in-out',
        opacity: isLoading ? 1 : 0,
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 shadow-lg"
        style={{
          width: `${progress}%`,
          transition: progress === 100 ? 'width 0.15s ease-out' : 'width 0.3s ease-out',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 8px rgba(168, 85, 247, 0.4)',
        }}
      />
      {/* Animated shimmer effect */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{
          width: '100px',
          transform: `translateX(${progress * 3}px)`,
          transition: 'transform 0.3s ease-out',
          opacity: isLoading ? 1 : 0,
        }}
      />
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useUserProfile() {
  const { data: session } = useSession();
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserAvatar(data.user.image);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUserAvatar(session.user.image);
        }
      }
    };

    if (session?.user) {
      loadUserProfile();
    }

    const handleFocus = () => {
      if (session?.user) {
        loadUserProfile();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user) {
        loadUserProfile();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [session]);

  return { userAvatar, userName: session?.user?.name };
}

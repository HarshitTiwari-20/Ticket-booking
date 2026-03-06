'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsClient(true);

    // Check localStorage directly for auth data
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.state?.isAuthenticated) {
          setIsHydrated(true);
          return;
        }
      } catch (e) {
        // localStorage parsing failed
      }
    }

    // If no auth data in localStorage, check if isAuthenticated from store
    if (isAuthenticated) {
      setIsHydrated(true);
    } else {
      // Give store 500ms to hydrate before redirecting
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          window.location.href = '/';
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isClient || !isHydrated) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

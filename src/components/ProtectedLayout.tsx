'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  if (!isClient || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

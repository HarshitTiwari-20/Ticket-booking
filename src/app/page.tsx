'use client';

import { useState, useEffect } from 'react';
import LoginComponent from '@/components/LoginComponent';
import SignupComponent from '@/components/SignupComponent';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {isLogin ? (
        <LoginComponent onToggleSignup={() => setIsLogin(false)} />
      ) : (
        <SignupComponent onToggleLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

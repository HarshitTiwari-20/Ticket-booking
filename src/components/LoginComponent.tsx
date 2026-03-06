'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useBookingStore } from '@/store/booking-store';
import { useUserStore } from '@/store/user-store';
import { CredentialsSchema } from '@/lib/validators';
import { ZodError } from 'zod';

interface LoginComponentProps {
  onToggleSignup?: () => void;
}

export default function LoginComponent({ onToggleSignup }: LoginComponentProps) {
  const { setCredentials } = useAuthStore();
  const { validateCredentials } = useUserStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'irctc' | 'app'>('irctc');
  const { clearBooking } = useBookingStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate credentials
      CredentialsSchema.parse({ username, password });

      // Check login type
      if (loginType === 'app') {
        // Validate against MongoDB
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Invalid username or password');
          setLoading(false);
          return;
        }
      }

      // Store encrypted credentials
      setCredentials(username, password);
      clearBooking();

      // Add a small delay to ensure state is saved to localStorage
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message || 'Validation failed');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary to-primary'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-2xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-secondary mb-2'>⚡ Tatkal Booking</h1>
          <p className='text-gray-600'>Lightning-fast ticket booking</p>
        </div>

        {/* Login Type Toggle */}
        <div className='flex gap-2 mb-6 bg-gray-100 rounded-lg p-1'>
          <button
            type='button'
            onClick={() => { setLoginType('irctc'); setError(''); }}
            className={`flex-1 py-2 px-3 rounded transition font-semibold text-sm ${
              loginType === 'irctc'
                ? 'bg-primary text-white'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            IRCTC Login
          </button>
          <button
            type='button'
            onClick={() => { setLoginType('app'); setError(''); }}
            className={`flex-1 py-2 px-3 rounded transition font-semibold text-sm ${
              loginType === 'app'
                ? 'bg-primary text-white'
                : 'bg-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            App Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
              {loginType === 'irctc' ? 'IRCTC User ID' : 'Username'} *
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={loginType === 'irctc' ? 'Enter your IRCTC User ID' : 'Enter your username'}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              {loginType === 'irctc' ? 'IRCTC Password' : 'Password'} *
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={loginType === 'irctc' ? 'Enter your IRCTC Password' : 'Enter your password'}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
              disabled={loading}
            />
          </div>

          {error && <div className='bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm'>{error}</div>}

          <button
            type='submit'
            disabled={loading || !username || !password}
            className='w-full bg-gradient-to-r from-secondary to-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className='my-6 flex items-center gap-4'>
          <div className='flex-1 h-px bg-gray-300'></div>
          <span className='text-gray-500 text-sm'>or</span>
          <div className='flex-1 h-px bg-gray-300'></div>
        </div>

        {/* Sign Up Link */}
        <button
          onClick={onToggleSignup}
          className='w-full border-2 border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary/5 transition'
        >
          Create New Account
        </button>

        <div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <p className='text-xs text-gray-700'>
            <strong>💡 Tip:</strong>
            <br/>
            • <strong>IRCTC Login:</strong> Use your existing IRCTC credentials
            <br/>
            • <strong>App Account:</strong> Create a new account in the app
            <br/>
            • Credentials are encrypted and stored locally for security
          </p>
        </div>
      </div>
    </div>
  );
}

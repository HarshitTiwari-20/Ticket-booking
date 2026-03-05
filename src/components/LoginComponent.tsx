'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useBookingStore } from '@/store/booking-store';
import { CredentialsSchema } from '@/lib/validators';
import { ZodError } from 'zod';

export default function LoginComponent() {
  const { setCredentials } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { clearBooking } = useBookingStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate credentials
      CredentialsSchema.parse({ username, password });

      // Store encrypted credentials
      setCredentials(username, password);
      clearBooking();

      // Redirect to dashboard
      window.location.href = '/dashboard';
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

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
              IRCTC User ID
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter your IRCTC User ID'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              IRCTC Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your IRCTC Password'
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

        <div className='mt-6 bg-warning/10 border border-warning rounded-lg p-4'>
          <p className='text-xs text-gray-600'>
            ⚠️ <strong>Security Note:</strong> Your credentials are encrypted and stored locally. Never share your password.
          </p>
        </div>
      </div>
    </div>
  );
}

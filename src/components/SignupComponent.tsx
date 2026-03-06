'use client';

import { useState } from 'react';
import { useUserStore } from '@/store/user-store';
import { ZodError } from 'zod';
import { z } from 'zod';

interface SignupComponentProps {
  onSignupSuccess?: () => void;
  onToggleLogin?: () => void;
}

const SignupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must not exceed 20 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupComponent({ onSignupSuccess, onToggleLogin }: SignupComponentProps) {
  const { registerUser } = useUserStore();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form
      SignupSchema.parse(formData);

      // Call API to register
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        onToggleLogin?.();
      }, 2000);
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
    <div className='w-full max-w-md bg-white rounded-lg shadow-2xl p-8'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-secondary mb-2'>⚡ Create Account</h1>
        <p className='text-gray-600'>Join for fast Tatkal booking</p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
            Username *
          </label>
          <input
            id='username'
            type='text'
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Choose your username'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
            Email *
          </label>
          <input
            id='email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='your@email.com'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
            Password *
          </label>
          <input
            id='password'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='At least 6 characters'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
            Confirm Password *
          </label>
          <input
            id='confirmPassword'
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder='Re-enter your password'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
            disabled={loading}
          />
        </div>

        {error && (
          <div className='bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm'>
            {error}
          </div>
        )}

        {success && (
          <div className='bg-success/10 border border-success text-success px-4 py-3 rounded-lg text-sm'>
            {success}
          </div>
        )}

        <button
          type='submit'
          disabled={loading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
          className='w-full bg-gradient-to-r from-secondary to-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='text-gray-600 text-sm'>
          Already have an account?{' '}
          <button
            onClick={onToggleLogin}
            className='text-primary hover:text-secondary font-semibold transition'
          >
            Login here
          </button>
        </p>
      </div>

      <div className='mt-6 bg-warning/10 border border-warning rounded-lg p-4'>
        <p className='text-xs text-gray-600'>
          ✅ <strong>Note:</strong> Create an account to get started, or login with your IRCTC credentials.
        </p>
      </div>
    </div>
  );
}

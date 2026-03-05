'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { PassengerSchema, Passenger } from '@/lib/validators';
import { ZodError } from 'zod';

interface PassengerFormProps {
  onPassengerAdded?: (passenger: Passenger) => void;
}

export default function PassengerForm({ onPassengerAdded }: PassengerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M' as const,
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const { addPassenger } = useBookingStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || '' : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const passenger = PassengerSchema.parse({
        ...formData,
        age: parseInt(formData.age as any) || 0,
      });

      addPassenger(passenger);
      onPassengerAdded?.(passenger);

      setFormData({
        name: '',
        age: '',
        gender: 'M',
        phone: '',
        email: '',
      });
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message || 'Validation failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-white rounded-lg p-6 space-y-4 border border-gray-200'>
      <h3 className='text-lg font-semibold text-secondary mb-4'>Add Passenger Details</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Passenger Name'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Age *</label>
          <input
            type='number'
            name='age'
            value={formData.age}
            onChange={handleChange}
            placeholder='Age'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Gender *</label>
          <select
            name='gender'
            value={formData.gender}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value='M'>Male</option>
            <option value='F'>Female</option>
            <option value='O'>Other</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Phone *</label>
          <input
            type='tel'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='10 digit mobile'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='your@email.com'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>
      </div>

      {error && <div className='bg-danger/10 border border-danger text-danger px-3 py-2 rounded text-sm'>{error}</div>}

      <button
        type='submit'
        className='w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition font-semibold'
      >
        Add Passenger
      </button>
    </form>
  );
}

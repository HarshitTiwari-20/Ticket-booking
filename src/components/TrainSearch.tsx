'use client';

import { useState } from 'react';
import { useBookingStore } from '@/store/booking-store';
import { BookingSchema } from '@/lib/validators';
import { ZodError } from 'zod';
import { apiClient } from '@/lib/api-client';

interface TrainSearchProps {
  onSearchStarted?: () => void;
  onSearchComplete?: (trains: any[]) => void;
}

const STATIONS = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'BCT', name: 'Mumbai Central' },
  { code: 'MAA', name: 'Chennai Central' },
  { code: 'HWH', name: 'Howrah, Kolkata' },
  { code: 'BL', name: 'Bangalore' },
  { code: 'BRC', name: 'Vadodara Jn' },
  { code: 'ST', name: 'Surat' },
  { code: 'LTT', name: 'Lokmanya Tilak (Mumbai)' },
];

const CLASS_TYPES = [
  { code: '1A', name: 'First AC (1A)' },
  { code: '2A', name: 'Second AC (2A)' },
  { code: '3A', name: 'Third AC (3A)' },
  { code: 'SL', name: 'Sleeper (SL)' },
  { code: 'FC', name: 'First Class (FC)' },
];

export default function TrainSearch({ onSearchStarted, onSearchComplete }: TrainSearchProps) {
  const { setBookingDetails } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fromStation: '',
    toStation: '',
    journeyDate: '',
    classType: '2A' as const,
    fareType: 'TATKAL' as const,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    onSearchStarted?.();

    try {
      // Validate booking details
      BookingSchema.parse({
        ...formData,
        trainNumber: 'TEMP',
        passengers: [{ name: 'test', age: 30, gender: 'M', phone: '9999999999', email: 'test@test.com' }],
      });

      setBookingDetails(formData);

      // For now, return mock trains
      // In production, call: await apiClient.getTrains(...)
      const mockTrains = [
        {
          trainNumber: '12951',
          trainName: 'Rajdhani Express',
          from: formData.fromStation,
          to: formData.toStation,
          departure: '22:30',
          arrival: '06:30',
          duration: '8h',
          seatAvailability: 45,
        },
        {
          trainNumber: '12903',
          trainName: 'Golden Chariot',
          from: formData.fromStation,
          to: formData.toStation,
          departure: '16:00',
          arrival: '23:45',
          duration: '7h 45m',
          seatAvailability: 12,
        },
      ];

      onSearchComplete?.(mockTrains);
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0].message || 'Validation failed');
      } else {
        setError('Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSearch} className='bg-white rounded-lg shadow-lg p-6 space-y-4'>
      <h2 className='text-2xl font-bold text-secondary mb-6'>🚆 Search Trains</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>From Station *</label>
          <select
            name='fromStation'
            value={formData.fromStation}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value=''>Select from</option>
            {STATIONS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>To Station *</label>
          <select
            name='toStation'
            value={formData.toStation}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value=''>Select to</option>
            {STATIONS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Journey Date *</label>
          <input
            type='date'
            name='journeyDate'
            value={formData.journeyDate}
            onChange={handleChange}
            min={today}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Class Type *</label>
          <select
            name='classType'
            value={formData.classType}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          >
            {CLASS_TYPES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Fare Type *</label>
          <select
            name='fareType'
            value={formData.fareType}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value='TATKAL'>Tatkal (⚡ Fast Booking)</option>
            <option value='GENERAL'>General</option>
          </select>
        </div>
      </div>

      {error && <div className='bg-danger/10 border border-danger text-danger px-3 py-2 rounded'>{error}</div>}

      <button
        type='submit'
        disabled={loading || !formData.fromStation || !formData.toStation || !formData.journeyDate}
        className='w-full bg-gradient-to-r from-secondary to-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {loading ? 'Searching...' : '🔍 Search Trains'}
      </button>
    </form>
  );
}

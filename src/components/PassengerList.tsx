'use client';

import { useBookingStore } from '@/store/booking-store';
import { Passenger } from '@/lib/validators';

interface PassengerListProps {
  onPassengerRemove?: (index: number) => void;
}

export default function PassengerList({ onPassengerRemove }: PassengerListProps) {
  const { passengers, removePassenger } = useBookingStore();

  const handleRemove = (index: number) => {
    removePassenger(index);
    onPassengerRemove?.(index);
  };

  if (passengers.length === 0) {
    return (
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-center'>
        <p className='text-gray-600'>No passengers added yet. Add at least one passenger to proceed.</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <h3 className='text-lg font-semibold text-secondary mb-4'>✅ Added Passengers ({passengers.length})</h3>
      {passengers.map((passenger, index) => (
        <div key={index} className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <h4 className='font-semibold text-gray-800'>{passenger.name}</h4>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600'>
                <p>
                  <span className='font-medium'>Age:</span> {passenger.age}
                </p>
                <p>
                  <span className='font-medium'>Gender:</span> {passenger.gender}
                </p>
                <p>
                  <span className='font-medium'>Phone:</span> {passenger.phone}
                </p>
                <p className='md:col-span-2'>
                  <span className='font-medium'>Email:</span> {passenger.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className='ml-4 px-3 py-1 bg-danger/10 text-danger rounded hover:bg-danger/20 transition text-sm font-medium'
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

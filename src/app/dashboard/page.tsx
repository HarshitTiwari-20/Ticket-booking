'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useBookingStore } from '@/store/booking-store';
import ProtectedLayout from '@/components/ProtectedLayout';
import BookingWindowTimer from '@/components/BookingWindowTimer';
import TrainSearch from '@/components/TrainSearch';
import PassengerForm from '@/components/PassengerForm';
import PassengerList from '@/components/PassengerList';

interface TrainInfo {
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  seatAvailability: number;
}

export default function Dashboard() {
  const { username, logout } = useAuthStore();
  const { passengers, bookingDetails } = useBookingStore();
  const [trains, setTrains] = useState<TrainInfo[]>([]);
  const [selectedTrain, setSelectedTrain] = useState<TrainInfo | null>(null);
  const [showPassengerForm, setShowPassengerForm] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleSearchComplete = (results: TrainInfo[]) => {
    setTrains(results);
    setSelectedTrain(null);
  };

  const handleBooking = async () => {
    if (!selectedTrain || passengers.length === 0) {
      alert('Please select a train and add at least one passenger');
      return;
    }

    // Here you would call the actual booking API
    console.log('Booking:', {
      train: selectedTrain,
      passengers,
      bookingDetails,
    });

    alert('Booking initiated! This is a demo. In production, this would connect to IRCTC API.');
  };

  return (
    <ProtectedLayout>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
        {/* Header */}
        <header className='bg-white shadow-sm sticky top-0 z-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-secondary flex items-center gap-2'>⚡ Tatkal Booking</h1>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-gray-600'>
                Logged in as: <strong>{username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-danger text-white rounded-lg hover:bg-opacity-90 transition text-sm'
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Booking Window Timer */}
          <div className='mb-8'>
            <BookingWindowTimer />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column - Search and Trains */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Train Search */}
              <TrainSearch onSearchComplete={handleSearchComplete} />

              {/* Available Trains */}
              {trains.length > 0 && (
                <div className='bg-white rounded-lg shadow-lg p-6'>
                  <h2 className='text-2xl font-bold text-secondary mb-4'>🚂 Available Trains</h2>
                  <div className='space-y-3 max-h-96 overflow-y-auto'>
                    {trains.map((train) => (
                      <div
                        key={train.trainNumber}
                        onClick={() => setSelectedTrain(train)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedTrain?.trainNumber === train.trainNumber
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-bold text-gray-800'>
                              {train.trainNumber} - {train.trainName}
                            </h3>
                            <div className='grid grid-cols-3 gap-4 mt-2 text-sm'>
                              <div>
                                <p className='text-gray-600'>Departure</p>
                                <p className='font-semibold'>{train.departure}</p>
                              </div>
                              <div>
                                <p className='text-gray-600'>Arrival</p>
                                <p className='font-semibold'>{train.arrival}</p>
                              </div>
                              <div>
                                <p className='text-gray-600'>Duration</p>
                                <p className='font-semibold'>{train.duration}</p>
                              </div>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className={`text-lg font-bold ${train.seatAvailability > 20 ? 'text-success' : 'text-warning'}`}>
                              {train.seatAvailability} seats
                            </p>
                            {selectedTrain?.trainNumber === train.trainNumber && (
                              <p className='text-xs text-primary font-semibold mt-1'>✓ Selected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Passengers */}
            <div className='space-y-6'>
              {/* Passenger Form */}
              <div>
                <button
                  onClick={() => setShowPassengerForm(!showPassengerForm)}
                  className='w-full mb-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition font-semibold'
                >
                  {showPassengerForm ? '✕ Hide Form' : '+ Add Passenger'}
                </button>
                {showPassengerForm && <PassengerForm />}
              </div>

              {/* Passenger List */}
              <PassengerList />

              {/* Booking Summary */}
              {selectedTrain && passengers.length > 0 && (
                <div className='bg-white rounded-lg shadow-lg p-6 border-2 border-primary'>
                  <h3 className='text-lg font-bold text-secondary mb-4'>📋 Booking Summary</h3>

                  <div className='space-y-3 text-sm'>
                    <div className='pb-3 border-b'>
                      <p className='text-gray-600'>Train</p>
                      <p className='font-semibold'>
                        {selectedTrain.trainNumber} - {selectedTrain.trainName}
                      </p>
                    </div>

                    <div className='pb-3 border-b'>
                      <p className='text-gray-600'>Passengers</p>
                      <p className='font-semibold'>{passengers.length}</p>
                    </div>

                    <div className='pb-3'>
                      <div className='flex gap-2 flex-wrap'>
                        {passengers.map((p, i) => (
                          <span key={i} className='bg-secondary/10 text-secondary px-2 py-1 rounded text-xs'>
                            {p.name.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className='w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:shadow-lg transition font-bold flex items-center justify-center gap-2'
                  >
                    🎫 Complete Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}

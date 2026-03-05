'use client';

import { useEffect, useState } from 'react';
import { timeSyncManager } from '@/lib/time-sync';

export default function BookingWindowTimer() {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Sync time on mount
    timeSyncManager.syncTime();

    const updateTimer = () => {
      setIsOpen(timeSyncManager.isBookingWindowOpen());

      if (isOpen) {
        setTimeRemaining('BOOKING WINDOW OPEN! 🎉');
        setCountdown('');
      } else {
        const ms = timeSyncManager.timeUntilBookingWindow();
        const formatted = timeSyncManager.formatTimeRemaining(ms);
        setTimeRemaining(formatted);

        // Calculate countdown for last 60 seconds
        if (ms < 60000) {
          const seconds = Math.floor(ms / 1000);
          setCountdown(`${seconds}s`);
        } else {
          setCountdown('');
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100); // Update every 100ms for precision

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <div
      className={`rounded-lg p-6 text-center ${isOpen ? 'bg-success/20 border-2 border-success' : 'bg-warning/20 border-2 border-warning'}`}
    >
      <h3 className='text-lg font-semibold text-secondary mb-2'>⏰ Booking Window</h3>
      <p className={`text-3xl font-bold ${isOpen ? 'text-success animate-pulse' : 'text-warning'}`}>
        {countdown || timeRemaining}
      </p>
      <p className='text-sm text-gray-600 mt-2'>
        {isOpen ? 'Tatkal booking is LIVE! Hurry up!' : 'Time until 11:00 AM booking window opens'}
      </p>
    </div>
  );
}

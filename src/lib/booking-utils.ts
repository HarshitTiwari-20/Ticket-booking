/**
 * Booking utility functions for Tatkal ticket optimizations
 */

import { TATKAL_BOOKING_CONFIG } from './constants';

/**
 * Check if current time falls within tatkal booking window
 */
export const isWithinBookingWindow = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const bookingTime =
    hours * 3600 + minutes * 60 + seconds >=
    TATKAL_BOOKING_CONFIG.BOOKING_HOUR * 3600 +
      TATKAL_BOOKING_CONFIG.BOOKING_MINUTE * 60 +
      TATKAL_BOOKING_CONFIG.BOOKING_SECOND;

  return bookingTime;
};

/**
 * Calculate time until tatkal booking window (in milliseconds)
 */
export const getTimeUntilBooking = (): number => {
  const now = new Date();
  const booking = new Date(now);

  booking.setHours(TATKAL_BOOKING_CONFIG.BOOKING_HOUR, TATKAL_BOOKING_CONFIG.BOOKING_MINUTE, 0, 0);

  // If booking time has passed today, calculate for tomorrow
  if (now > booking) {
    booking.setDate(booking.getDate() + 1);
  }

  return booking.getTime() - now.getTime();
};

/**
 * Format milliseconds to human readable time
 */
export const formatTimeRemaining = (ms: number): string => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Predict optimal retry timing based on network conditions
 */
export const calculateRetryDelay = (attemptNumber: number, baseDelay: number = 1000): number => {
  // Exponential backoff: 1s, 2s, 4s, 8s, etc.
  const exponentialDelay = baseDelay * Math.pow(2, attemptNumber);
  // Add random jitter to prevent thundering herd
  const jitter = Math.random() * 1000;
  return exponentialDelay + jitter;
};

/**
 * Validate PNR format
 */
export const isValidPNR = (pnr: string): boolean => {
  // PNR should be 10 digits
  return /^\d{10}$/.test(pnr);
};

/**
 * Validate train number format
 */
export const isValidTrainNumber = (trainNumber: string): boolean => {
  // Train numbers are typically 5-6 digits
  return /^\d{5,6}$/.test(trainNumber);
};

/**
 * Calculate seat availability percentage
 */
export const getSeatAvailabilityPercentage = (available: number, total: number): number => {
  return Math.round((available / total) * 100);
};

/**
 * Check if seats are critically low
 */
export const areSeatsLow = (available: number, threshold: number = 5): boolean => {
  return available <= threshold;
};

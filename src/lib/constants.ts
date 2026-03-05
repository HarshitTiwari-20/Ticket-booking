// Create a constant for booking window timing
export const TATKAL_BOOKING_CONFIG = {
  BOOKING_HOUR: 11,
  BOOKING_MINUTE: 0,
  BOOKING_SECOND: 0,
  REQUEST_TIMEOUT_MS: 5000,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_BACKOFF_MS: 1000,
} as const;

// Train classes available for Tatkal booking
export const TRAIN_CLASSES = [
  { code: '1A', name: 'First AC', price_factor: 1.8 },
  { code: '2A', name: 'Second AC', price_factor: 1.5 },
  { code: '3A', name: 'Third AC', price_factor: 1.2 },
  { code: 'SL', name: 'Sleeper', price_factor: 1.0 },
  { code: 'FC', name: 'First Class', price_factor: 1.6 },
  { code: 'ER', name: 'Executive', price_factor: 2.2 },
] as const;

// Common Indian Railway stations
export const MAJOR_STATIONS = {
  metro_stations: [
    { code: 'NDLS', name: 'New Delhi', state: 'Delhi' },
    { code: 'BCT', name: 'Mumbai Central', state: 'Maharashtra' },
    { code: 'MAA', name: 'Chennai Central', state: 'Tamil Nadu' },
    { code: 'HWH', name: 'Howrah (Kolkata)', state: 'West Bengal' },
    { code: 'CSTM', name: 'CST (Mumbai)', state: 'Maharashtra' },
    { code: 'BL', name: 'Bangalore City', state: 'Karnataka' },
  ],
  major_junctions: [
    { code: 'JBP', name: 'Jabalpur', state: 'Madhya Pradesh' },
    { code: 'BRC', name: 'Vadodara', state: 'Gujarat' },
    { code: 'ST', name: 'Surat', state: 'Gujarat' },
    { code: 'NGP', name: 'Nagpur', state: 'Maharashtra' },
  ],
} as const;

// Error messages for user-friendly feedback
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Please fill in all required fields correctly',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  CREDENTIALS_INVALID: 'Invalid credentials. Please check and try again.',
  WINDOW_NOT_OPEN: 'Tatkal booking window not open yet.',
  API_TIMEOUT: 'API request timed out. Please refresh and try again.',
  SEAT_NOT_AVAILABLE: 'Seats not available for selected train.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  BOOKING_SUBMITTED: 'Booking submitted. Awaiting confirmation...',
  BOOKING_CONFIRMED: 'Booking confirmed! Your PNR has been issued.',
  PASSENGER_ADDED: 'Passenger added successfully.',
} as const;

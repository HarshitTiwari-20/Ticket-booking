import { z } from 'zod';

export const CredentialsSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const PassengerSchema = z.object({
  name: z.string().min(1, 'Passenger name is required'),
  age: z.number().int().min(1).max(120),
  gender: z.enum(['M', 'F', 'O']),
  phone: z.string().regex(/^[0-9]{10}$/, 'Valid 10-digit phone number required'),
  email: z.string().email('Valid email required'),
});

export const BookingSchema = z.object({
  fromStation: z.string().min(1, 'From station is required'),
  toStation: z.string().min(1, 'To station is required'),
  journeyDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'),
  trainNumber: z.string().min(1, 'Train number is required'),
  classType: z.enum(['1A', '2A', '3A', 'SL', 'FC', 'ER']),
  fareType: z.enum(['TATKAL', 'GENERAL']),
  passengers: z.array(PassengerSchema).min(1, 'At least one passenger is required'),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
export type Passenger = z.infer<typeof PassengerSchema>;
export type BookingRequest = z.infer<typeof BookingSchema>;

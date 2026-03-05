import { create } from 'zustand';
import { BookingRequest, Passenger } from '@/lib/validators';

interface BookingState {
  bookingDetails: Partial<BookingRequest>;
  passengers: Passenger[];
  bookingHistory: any[];

  // Setters
  setBookingDetails: (details: Partial<BookingRequest>) => void;
  setPassengers: (passengers: Passenger[]) => void;
  addPassenger: (passenger: Passenger) => void;
  removePassenger: (index: number) => void;
  updatePassenger: (index: number, passenger: Passenger) => void;
  addBookingToHistory: (booking: any) => void;
  clearBooking: () => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookingDetails: {},
  passengers: [],
  bookingHistory: [],

  setBookingDetails: (details) =>
    set((state) => ({
      bookingDetails: { ...state.bookingDetails, ...details },
    })),

  setPassengers: (passengers) => set({ passengers }),

  addPassenger: (passenger) =>
    set((state) => ({
      passengers: [...state.passengers, passenger],
    })),

  removePassenger: (index) =>
    set((state) => ({
      passengers: state.passengers.filter((_, i) => i !== index),
    })),

  updatePassenger: (index, passenger) =>
    set((state) => ({
      passengers: state.passengers.map((p, i) => (i === index ? passenger : p)),
    })),

  addBookingToHistory: (booking) =>
    set((state) => ({
      bookingHistory: [booking, ...state.bookingHistory].slice(0, 10), // Keep last 10
    })),

  clearBooking: () =>
    set({
      bookingDetails: {},
      passengers: [],
    }),

  resetBooking: () =>
    set({
      bookingDetails: {},
      passengers: [],
      bookingHistory: [],
    }),
}));

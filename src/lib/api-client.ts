import axios, { AxiosInstance, AxiosError } from 'axios';

const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_TIMEOUT || '5000', 10);
const MAX_RETRIES = parseInt(process.env.NEXT_PUBLIC_MAX_RETRIES || '3', 10);

interface RetryConfig {
  retries: number;
  delay: number;
}

class TatkalApiClient {
  private client: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_IRCTC_API_BASE || 'https://www.irctc.co.in/nget/tatkalapi',
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    this.retryConfig = {
      retries: MAX_RETRIES,
      delay: 1000,
    };

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config;
        if (!config) return Promise.reject(error);

        const retryCount = (config as any).retryCount || 0;

        if (retryCount < this.retryConfig.retries && error.response?.status === 408) {
          (config as any).retryCount = retryCount + 1;

          // Exponential backoff
          const delay = this.retryConfig.delay * Math.pow(2, retryCount);
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  async login(username: string, password: string) {
    try {
      const response = await this.client.post('/login', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async getTrains(
    fromStation: string,
    toStation: string,
    journeyDate: string,
    classType: string
  ) {
    try {
      const response = await this.client.post('/getTrains', {
        fromStation,
        toStation,
        journeyDate,
        classType,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trains:', error);
      throw error;
    }
  }

  async bookTicket(
    trainNumber: string,
    fromStation: string,
    toStation: string,
    journeyDate: string,
    passengers: any[]
  ) {
    try {
      const response = await this.client.post('/booking', {
        trainNumber,
        fromStation,
        toStation,
        journeyDate,
        passengers,
      });
      return response.data;
    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  }

  async getBookingStatus(bookingId: string) {
    try {
      const response = await this.client.get(`/booking/status/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get booking status:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string) {
    try {
      const response = await this.client.post(`/booking/cancel/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Cancellation failed:', error);
      throw error;
    }
  }
}

export const apiClient = new TatkalApiClient();

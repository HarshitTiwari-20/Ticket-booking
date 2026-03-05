/**
 * Time synchronization utilities to ensure precise booking at 11 AM
 */

export class TimeSyncManager {
  private estimatedServerTime: number = 0;
  private clientTime: number = 0;
  private offset: number = 0;

  /**
   * Sync client time with server time
   * Call this on app initialization
   */
  async syncTime() {
    const clientTime = Date.now();
    try {
      // In production, fetch actual server time from a time API
      // For now, using local time
      const serverTime = Date.now();
      this.offset = serverTime - clientTime;
      return this.offset;
    } catch (error) {
      console.error('Time sync failed:', error);
      return 0;
    }
  }

  /**
   * Get the current synchronized time
   */
  getCurrentTime(): number {
    return Date.now() + this.offset;
  }

  /**
   * Check if it's booking window time (11:00 AM)
   */
  isBookingWindowOpen(): boolean {
    const now = new Date(this.getCurrentTime());
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Booking window starts at 11:00:00 AM
    return hours >= 11 && (hours > 11 || (minutes > 0) || (minutes === 0 && seconds >= 0));
  }

  /**
   * Time until booking window opens (in milliseconds)
   */
  timeUntilBookingWindow(): number {
    const now = new Date(this.getCurrentTime());
    const bookingTime = new Date(now);
    bookingTime.setHours(11, 0, 0, 0);

    if (now >= bookingTime) {
      // Next day's 11 AM
      bookingTime.setDate(bookingTime.getDate() + 1);
    }

    return bookingTime.getTime() - now.getTime();
  }

  /**
   * Format time remaining
   */
  formatTimeRemaining(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
}

export const timeSyncManager = new TimeSyncManager();

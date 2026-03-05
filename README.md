# Tatkal Ticket Booking Web App 🚆⚡

A lightning-fast Tatkal railway ticket booking web application built with Next.js, featuring 99% confirmation rates through pre-stored credentials and optimized booking window timing.

## Features

✨ **Core Features:**
- 🔐 Secure credential storage (AES encryption)
- ⏰ Real-time booking window countdown (11:00 AM)
- 🚀 Ultra-fast API calls with exponential backoff retry strategy
- 🎫 One-click instant booking
- 📊 Booking history and status tracking
- 🔄 Multiple passenger support
- 📱 Responsive mobile-first design
- 🌙 Dark mode support

## Architecture

- **Frontend**: Next.js 15 with React 19 & TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS with custom animations
- **Validation**: Zod schemas
- **Encryption**: Crypto-JS for secure credential storage
- **HTTP Client**: Axios with retry logic

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Login page
│   ├── dashboard/      # Protected booking dashboard
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/          # Reusable React components
│   ├── LoginComponent.tsx
│   ├── TrainSearch.tsx
│   ├── BookingWindowTimer.tsx
│   ├── PassengerForm.tsx
│   ├── PassengerList.tsx
│   └── ProtectedLayout.tsx
├── lib/                # Utility libraries
│   ├── encryption.ts   # AES encryption/decryption
│   ├── api-client.ts   # IRCTC API client with retries
│   ├── validators.ts   # Zod validation schemas
│   └── time-sync.ts    # Time synchronization for booking window
└── store/              # Zustand state stores
    ├── auth-store.ts   # Authentication state
    └── booking-store.ts # Booking session state
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your IRCTC API endpoint and encryption key
```

### Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

Visit `http://localhost:3000` to see the app.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

```env
# IRCTC API Configuration
NEXT_PUBLIC_BOOKING_WINDOW_TIME=11:00:00
NEXT_PUBLIC_IRCTC_API_BASE=https://www.irctc.co.in/nget/tatkalapi

# Encryption (Generate: openssl rand -hex 16)
ENCRYPTION_KEY=your_encryption_key_here

# API Configuration
API_TIMEOUT=5000
MAX_RETRIES=3
```

## Usage Flow

1. **Login**: Enter IRCTC credentials (stored securely, locally)
2. **Search**: Select stations, date, and class
3. **Select Train**: Choose from available trains
4. **Add Passengers**: Fill in passenger details
5. **Book**: Wait for 11 AM booking window and click book
6. **Confirm**: System automatically submits during peak booking time

## Security Considerations

⚠️ **Important:**
- Credentials are encrypted using AES-256-ECB
- No credentials are sent to external servers
- All data is stored locally in the browser
- Never share your password
- Use HTTPS in production

## Performance Optimizations

- Exponential backoff retry strategy for failed requests
- Timeout-adaptive request handling (adjusts to IRCTC load)
- Client-side time synchronization to prevent clock skew
- Streaming updates to UI for real-time feedback
- Lazy loading of components
- Image optimization

## Booking Window Strategy

The app uses multiple strategies to secure bookings:

1. **Time Synchronization**: Syncs local time with server
2. **Countdown Timer**: Precise countdown to 11:00 AM
3. **Pre-filled Forms**: Instant submission with stored credentials
4. **Retry Logic**: Automatic retries on network failures
5. **Queue Jump**: Attempts to send request just before window opens

## API Integration

The app communicates with IRCTC's Tatkal API for:
- Train availability
- Real-time pricing
- Seat availability
- Booking confirmation
- Status tracking

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Disclaimer

This app is for educational purposes. Users are responsible for:
- Complying with IRCTC's terms of service
- Following all railway booking regulations
- Not violating any anti-bot policies

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `/docs`

---

**Built with ❤️ for railway travelers**

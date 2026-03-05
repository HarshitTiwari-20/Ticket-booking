# API Integration Guide

## IRCTC Tatkal API Integration

This guide explains how to integrate the Tatkal app with IRCTC's actual APIs.

## API Endpoints

### 1. Authentication

**Endpoint**: `POST /tatkalapi/user/login`

```javascript
// Request
{
  "username": "your_irctc_userid",
  "password": "your_irctc_password"
}

// Response
{
  "status": 200,
  "data": {
    "sessionId": "ABC123XYZ",
    "userName": "john_doe",
    "email": "john@example.com",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

### 2. Get Available Trains

**Endpoint**: `POST /tatkalapi/trains/search`

```javascript
// Request
{
  "fromStationCode": "NDLS",
  "toStationCode": "BCT",
  "journeyDate": "2026-03-15",
  "classType": "2A",
  "fareType": "TATKAL"
}

// Response
{
  "status": 200,
  "data": [
    {
      "trainNumber": "12951",
      "trainName": "Rajdhani Express",
      "departureTime": "22:30",
      "arrivalTime": "06:30",
      "duration": "08:00",
      "distance": 1447,
      "classes": [
        {
          "classCode": "2A",
          "className": "Second AC",
          "availability": {
            "available": 45,
            "total": 80,
            "status": "AVAILABLE"
          },
          "fare": 2450
        }
      ]
    }
  ]
}
```

### 3. Check Seat Availability

**Endpoint**: `POST /tatkalapi/trains/availability`

```javascript
// Request
{
  "trainNumber": "12951",
  "classCode": "2A"
}

// Response
{
  "status": 200,
  "data": {
    "available": 45,
    "total": 80,
    "lastUpdated": "2026-03-15T10:58:30Z"
  }
}
```

### 4. Book Ticket

**Endpoint**: `POST /tatkalapi/booking/reserve`

```javascript
// Request
{
  "trainNumber": "12951",
  "fromStation": "NDLS",
  "toStation": "BCT",
  "journeyDate": "2026-03-15",
  "classType": "2A",
  "passengers": [
    {
      "passengerName": "John Doe",
      "age": 30,
      "gender": "M",
      "berthPreference": "ANY",
      "seatPreference": "WINDOW"
    },
    {
      "passengerName": "Jane Doe",
      "age": 28,
      "gender": "F",
      "berthPreference": "ANY",
      "seatPreference": "AISLE"
    }
  ],
  "fareType": "TATKAL",
  "paymentMethod": "NETBANKING"
}

// Response
{
  "status": 200,
  "data": {
    "pnr": "1234567890",
    "bookingStatus": "CONFIRMED",
    "totalFare": 5450,
    "taxAmount": 450,
    "confirmationNumber": "ABC123XYZ",
    "bookingTime": "2026-03-15T11:00:05Z"
  }
}
```

### 5. Get Booking Status

**Endpoint**: `GET /tatkalapi/booking/status/{pnr}`

```javascript
// Response
{
  "status": 200,
  "data": {
    "pnr": "1234567890",
    "bookingStatus": "CONFIRMED",
    "trainNumber": "12951",
    "trainName": "Rajdhani Express",
    "passengers": [
      {
        "passengerName": "John Doe",
        "seatNumber": "4A",
        "coachNumber": "B3"
      },
      {
        "passengerName": "Jane Doe",
        "seatNumber": "5A",
        "coachNumber": "B3"
      }
    ],
    "totalFare": 5450,
    "journey": {
      "from": "New Delhi",
      "to": "Mumbai Central",
      "date": "2026-03-15",
      "departureTime": "22:30",
      "arrivalTime": "06:30"
    }
  }
}
```

### 6. Cancel Booking

**Endpoint**: `POST /tatkalapi/booking/cancel/{pnr}`

```javascript
// Request
{
  "cancellationReason": "User requested"
}

// Response
{
  "status": 200,
  "data": {
    "pnr": "1234567890",
    "cancellationStatus": "CANCELLED",
    "refundAmount": 4450,
    "cancellationTime": "2026-03-15T11:30:00Z",
    "refundETADays": "3-5"
  }
}
```

## Implementation in api-client.ts

### Update the API client with real endpoints:

```typescript
import axios, { AxiosInstance } from 'axios';

class TatkalApiClient {
  private client: AxiosInstance;
  private sessionId: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_IRCTC_API_BASE,
      timeout: parseInt(process.env.NEXT_PUBLIC_TIMEOUT || '5000', 10),
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0...',
        'X-Client-Version': '1.0.0',
      },
    });
  }

  async login(username: string, password: string) {
    const response = await this.client.post('/user/login', {
      username,
      password,
    });

    if (response.data.data?.sessionId) {
      this.sessionId = response.data.data.sessionId;
      this.client.defaults.headers.common['Session-Id'] = this.sessionId;
    }

    return response.data;
  }

  async getTrains(fromStation: string, toStation: string, journeyDate: string, classType: string) {
    const response = await this.client.post('/trains/search', {
      fromStationCode: fromStation,
      toStationCode: toStation,
      journeyDate,
      classType,
      fareType: 'TATKAL',
    });
    return response.data;
  }
}
```

## Security Considerations

### 1. HTTPS Only
- Always use HTTPS in production
- Prevent man-in-the-middle attacks

### 2. Rate Limiting
- IRCTC may rate limit requests
- Implement backoff strategies
- Use connection pooling

### 3. Session Management
- Store session IDs securely
- Handle session expiration
- Auto-logout on invalid session

### 4. Error Handling
```typescript
const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // Unauthorized - login again
    logout();
  } else if (error.response?.status === 429) {
    // Too many requests - wait and retry
  } else if (error.response?.status === 503) {
    // Service unavailable - queue and retry
  }
};
```

## Testing API Endpoints

### Using cURL:
```bash
# Login
curl -X POST https://www.irctc.co.in/nget/tatkalapi/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_id","password":"your_password"}'

# Search trains
curl -X POST https://www.irctc.co.in/nget/tatkalapi/trains/search \
  -H "Content-Type: application/json" \
  -H "Session-Id: ABC123XYZ" \
  -d '{
    "fromStationCode":"NDLS",
    "toStationCode":"BCT",
    "journeyDate":"2026-03-15",
    "classType":"2A"
  }'
```

### Using Postman:
1. Create a new collection "Tatkal Booking"
2. Set base URL: `{{api_base_url}}`
3. Create requests for each endpoint
4. Use environment variables for session tokens

## Rate Limiting Strategy

```javascript
const rateLimiter = {
  requestsPerSecond: 3,
  queue: [],

  async request(fn) {
    this.queue.push(fn);
    this.process();
  },

  async process() {
    if (this.queue.length === 0) return;

    const fn = this.queue.shift();
    try {
      return await fn();
    } finally {
      setTimeout(() => this.process(), 1000 / this.requestsPerSecond);
    }
  }
};
```

## Monitoring & Logging

```typescript
// Log all requests
this.client.interceptors.request.use((config) => {
  console.log(`[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Log all responses
this.client.interceptors.response.use(
  (response) => {
    console.log(`Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`Error: ${error.response?.status} - ${error.message}`);
    return Promise.reject(error);
  }
);
```

## Production Checklist

- [ ] Replace mock endpoints with real IRCTC APIs
- [ ] Implement proper error handling
- [ ] Set up retry logic with exponential backoff
- [ ] Configure rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Test with real credentials (safely)
- [ ] Implement session timeout handling
- [ ] Add request/response logging
- [ ] Set up alerting for failures

## Common Issues

### Issue: "Invalid Session"
- Session expired, relogin
- Check session timeout (typically 30 minutes)

### Issue: "Seat Not Available"
- Check availability real-time
- Implement fallback options
- Notify user immediately

### Issue: "Payment Failed"
- Implement retry mechanism
- Provide transaction ID to user
- Check payment gateway logs

### Issue: "Timeout Errors"
- Increase timeout for high-load periods
- Implement longer retry delays
- Check network connectivity

## Future Enhancements

1. **WebSocket Support**: Real-time seat availability
2. **Payment Gateway Integration**: Debit/Credit cards, UPI
3. **SMS Notifications**: Booking confirmations
4. **Email Integration**: Receipt and details
5. **Refund Tracking**: Monitor refund status
6. **Analytics Dashboard**: Booking patterns and success rates

---

**Note**: Ensure all API integration complies with IRCTC's terms of service and fair use policies.

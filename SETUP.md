# Quick Setup Guide

## 1. Generate Encryption Key

Generate a secure encryption key for credential storage:

```bash
openssl rand -hex 16
```

Copy the output and add it to `.env.local`:

```env
ENCRYPTION_KEY=<paste_your_generated_key_here>
```

## 2. Configure IRCTC API Endpoint

Update the IRCTC API endpoint in `.env.local`:

```env
NEXT_PUBLIC_IRCTC_API_BASE=https://www.irctc.co.in/nget/tatkalapi
```

## 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 4. Login

1. Enter your IRCTC User ID
2. Enter your IRCTC Password
3. Click "Login"

Your credentials are encrypted and stored locally.

## 5. Search for Trains

1. Select departure and destination stations
2. Select journey date
3. Select class type (2A, 3A, SL, etc.)
4. Choose Tatkal fare type
5. Click "Search Trains"

## 6. Add Passengers

For each passenger:
1. Enter name
2. Enter age
3. Select gender
4. Enter 10-digit phone number
5. Enter email address
6. Click "Add Passenger"

## 7. Select Train and Book

1. Click on a train to select it
2. The booking summary on the right will update
3. At 11:00 AM, the booking window timer will show "BOOKING WINDOW OPEN!"
4. Click "Complete Booking" to submit

## Security Best Practices

✅ DO:
- Use a strong IRCTC password
- Keep your encryption key secret
- Don't share your browser session
- Use HTTPS in production
- Regularly update the app

❌ DON'T:
- Share your IRCTC credentials
- Use the same password elsewhere
- Run on public WiFi without VPN
- Leave the app logged in on shared computers

## Troubleshooting

### "Cannot GET /dashboard"
- Not logged in. Go to home page and login first.

### Credentials not saving
- Check if browser allows localStorage
- Disable incognito/private mode
- Check browser console for errors

### API calls failing
- Verify IRCTC API endpoint is correct
- Check network connectivity
- Ensure API is not rate-limited
- Check server logs

### Time synchronization issues
- Close and reopen app to re-sync
- Check system clock accuracy
- Verify server time endpoint (in production)

## Performance Tips

1. **Pre-fill before 11 AM**: Have all passengers ready 5 minutes before
2. **Use Chrome/Firefox**: Better performance than Safari
3. **Close other tabs**: Reduces CPU usage
4. **Stable internet**: Use wired connection if possible
5. **Server close to you**: Reduces latency

## Booking Window Optimization

The app uses several techniques to get ahead of the queue:

1. **Client-Side Validation**: Forms validated before submission
2. **Pre-encrypted Credentials**: Password encrypted at login, not at booking
3. **Exponential Backoff**: Smart retry timing
4. **Queue Prediction**: Attempts to submit slightly before 11:00

## API Response Times

For optimal results, target response times should be:
- Search trains: < 500ms
- Get availability: < 300ms
- Book ticket: < 1000ms (during peak hours)

## Production Deployment

### Set production encryption key:
```bash
# Generate a strong key for production
openssl rand -hex 32

# Add to environment
ENCRYPTION_KEY=<your_key>
```

### Deploy to Vercel:
```bash
vercel deploy --prod
```

### Environment variables in Vercel dashboard:
1. Go to Settings > Environment Variables
2. Add all .env.local variables
3. Redeploy

### Security headers in production:
- All configured in `next.config.js`
- HTTPS required
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY

## Database Integration (Optional)

To track booking history across sessions, add a database:

```bash
npm install @prisma/client prisma
npx prisma init
```

Configure in `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/tatkal_db"
```

Then create a booking history schema in `prisma/schema.prisma`.

## Contact & Support

For issues:
1. Check this guide
2. Review console errors (F12 in browser)
3. Open an issue on GitHub
4. Contact support

---

Happy booking! 🎫✨

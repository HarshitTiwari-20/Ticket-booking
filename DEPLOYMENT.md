# Deployment Guide

## Local Development

### 1. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Run Tests

```bash
npm run lint
npm run type-check
```

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is optimized for Next.js deployments.

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Self-Hosted (Docker)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package* ./

# Install dependencies
RUN npm ci

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV production

# Start the app
CMD ["npm", "start"]
```

Build and run:

```bash
# Build Docker image
docker build -t tatkal-booking .

# Run container
docker run -p 3000:3000 \
  -e ENCRYPTION_KEY=your_key \
  -e NEXT_PUBLIC_IRCTC_API_BASE=your_api \
  tatkal-booking
```

### Option 3: AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Clone repo
git clone your-repo-url
cd tatkal-ticket

# Install and build
npm install
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "tatkal" -- start
pm2 startup
pm2 save
```

### Option 4: Railway.app

```bash
# Install Railway CLI
npm i -g railway

# Login
railway login

# Deploy
railway up
```

## Environment Configuration

### Production .env.local

```env
# API Configuration
NEXT_PUBLIC_IRCTC_API_BASE=https://api.irctc.co.in
NEXT_PUBLIC_BOOKING_WINDOW_TIME=11:00:00

# Security
ENCRYPTION_KEY=your_production_key_here
API_TIMEOUT=5000
MAX_RETRIES=3

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Database Setup (Optional)

If using PostgreSQL with Prisma:

```bash
npm install @prisma/client prisma
npx prisma init
```

Configure `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@db-host:5432/tatkal_db"
```

Create schema in `prisma/schema.prisma`:

```prisma
model BookingHistory {
  id        String    @id @default(cuid())
  userId    String
  trainNumber String
  pnr       String?
  status    String
  passengers Int
  totalFare Decimal
  bookingTime DateTime
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

Run migrations:

```bash
npx prisma migrate dev --name init
```

## Performance Optimization

### 1. Enable Compression

```javascript
// next.config.js
compress: true,
```

### 2. Image Optimization

```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}
```

### 3. Caching Strategy

```javascript
// next.config.js
headers: async () => [
  {
    source: '/api/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'no-cache, no-store, must-revalidate',
      },
    ],
  },
]
```

## Monitoring & Logging

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

In `next.config.js`:

```javascript
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  // ... your config
};

module.exports = withSentryConfig(nextConfig, {
  org: "your-sentry-org",
  project: "tatkal-booking",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

### 2. Analytics (Google Analytics)

Add to `layout.tsx`:

```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `,
          }}
        />
      </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run type-check && npm run lint

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel deploy --prod
```

## Backup & Recovery

### Database Backup

```bash
# PostgreSQL backup
pg_dump --host=your-host --username=user --database=tatkal_db > backup.sql

# Restore
psql --host=your-host --username=user --database=tatkal_db < backup.sql
```

## Rolling Updates

For zero-downtime deployments:

```bash
# Vercel handles this automatically

# For Docker:
docker-compose up -d --scale app=2
docker-compose rm old_container
```

## Monitoring Checklist

- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics (Google Analytics)
- [ ] Monitor API rate limits
- [ ] Track booking success rates
- [ ] Monitor response times
- [ ] Set up alerts for errors
- [ ] Log all booking attempts
- [ ] Monitor database performance
- [ ] Track user growth
- [ ] Monitor security metrics

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next
npm install
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Environment Variables Not Loaded

```bash
# Verify .env.local exists
cat .env.local

# For Vercel
vercel env list
vercel env pull
```

## Scaling Considerations

- Use CDN for static assets
- Implement database connection pooling
- Use Redis for caching
- Enable horizontal scaling
- Monitor resource usage
- Implement rate limiting

## Security Hardening

- Enable HTTPS only
- Set security headers
- Implement CSRF protection
- Validate all inputs
- Use environment variables for secrets
- Regular dependency updates
- SQL injection prevention (Prisma)
- XSS protection

---

**Deployment Status**: ✅ Ready for Production

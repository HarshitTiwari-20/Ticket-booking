# Quick Reference Card

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate encryption key
openssl rand -hex 16

# 3. Create .env.local with the key
ENCRYPTION_KEY=your_key_here

# 4. Start dev server
npm run dev
```

## Common Commands

```bash
npm run dev              # Start development server (localhost:3000)
npm run build           # Build for production
npm start               # Start production server
npm run type-check      # Run TypeScript type checking
npm run lint            # Run ESLint
docker build -t app .   # Build Docker image
docker run -p 3000:3000 app  # Run Docker container
```

## Project Structure

```
src/app/              → Pages & layouts
src/components/       → React components
src/lib/             → Utilities & services
src/store/           → Zustand stores (state)
public/              → Static assets
```

## Key Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Login page |
| `src/app/dashboard/page.tsx` | Main booking dashboard |
| `src/lib/encryption.ts` | Credential encryption |
| `src/lib/api-client.ts` | IRCTC API client |
| `src/store/auth-store.ts` | Auth state |
| `src/store/booking-store.ts` | Booking state |

## Component Usage

```typescript
// Import from components
import LoginComponent from '@/components/LoginComponent';
import TrainSearch from '@/components/TrainSearch';

// Use in page
export default function Page() {
  return <TrainSearch />;
}
```

## State Management

```typescript
// Use auth store
const { isAuthenticated, username, logout } = useAuthStore();

// Use booking store
const { passengers, bookingDetails, addPassenger } = useBookingStore();
```

## API Calls

```typescript
import { apiClient } from '@/lib/api-client';

// Login
await apiClient.login(username, password);

// Search trains
await apiClient.getTrains(from, to, date, classType);

// Book ticket
await apiClient.bookTicket(trainNumber, from, to, date, passengers);
```

## Validation

```typescript
import { CredentialsSchema, PassengerSchema } from '@/lib/validators';

// Validate credentials
CredentialsSchema.parse({ username, password });

// Validate passenger
PassengerSchema.parse(passengerData);
```

## Styling with Tailwind

```jsx
// Colors available
primary: #FF6B35
secondary: #004E89
success: #06D6A0
warning: #FFD166
danger: #EF476F

// Usage
<div className="bg-primary text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Title</h1>
  <button className="bg-secondary hover:bg-secondary/90">Click</button>
</div>
```

## Environment Variables

```
NEXT_PUBLIC_IRCTC_API_BASE=https://...
NEXT_PUBLIC_BOOKING_WINDOW_TIME=11:00:00
NEXT_PUBLIC_TIMEOUT=5000
NEXT_PUBLIC_MAX_RETRIES=3
ENCRYPTION_KEY=your_key
```

## Debugging

```javascript
// Check auth state
console.log(useAuthStore.getState());

// Check booking state
console.log(useBookingStore.getState());

// Check local storage
console.log(localStorage);
```

## Error Handling

```typescript
try {
  await apiClient.login(username, password);
} catch (error) {
  if (error instanceof ZodError) {
    // Validation error
  } else {
    // API error
  }
}
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes & commit
git add .
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request
```

## Performance Optimization

```typescript
// Use 'use client' for interactive components
'use client';

// Lazy load component
const MyComponent = dynamic(() => import('@/components/MyComponent'), {
  loading: () => <div>Loading...</div>,
});

// Use memo for expensive components
const ExpensiveComponent = memo(function({ data }) {
  return <div>{data}</div>;
});
```

## Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## Deployment Checklist

- [ ] Run `npm run build` - ensure no errors
- [ ] Set all environment variables
- [ ] Generate strong encryption key
- [ ] Configure HTTPS
- [ ] Set up error tracking
- [ ] Enable CORS for API
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Test booking flow
- [ ] Deploy to staging first

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Zustand Docs](https://zustand.surge.sh/)

## Keyboard Shortcuts (VS Code)

```
Ctrl+Shift+P     Command palette
Ctrl+/           Comment line
Alt+Up/Down      Move line
Ctrl+K Ctrl+C    Comment block
F2               Rename symbol
Ctrl+G           Go to line
Ctrl+F           Find
Ctrl+H           Find & replace
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| Module not found | `npm install` |
| Type errors | `npm run type-check` |
| Build fails | `rm -rf .next && npm run build` |
| Credentials not saving | Check browser localStorage |

## Performance Tips

- Close unused tabs
- Disable browser extensions
- Use Chrome/Firefox (better devtools)
- Disable dark mode for faster rendering
- Use wired internet connection
- Keep project on SSD

## Security Reminders

🔐 **Do:**
- ✅ Use HTTPS in production
- ✅ Keep encryption key secret
- ✅ Validate all inputs
- ✅ Use environment variables
- ✅ Update dependencies regularly

🚫 **Don't:**
- ❌ Commit .env.local to Git
- ❌ Log sensitive data
- ❌ Store passwords in code
- ❌ Use weak encryption keys
- ❌ Ignore security warnings

---

**Print this card for quick reference!**

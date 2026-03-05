# Developer Guide

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd tatkal-ticket

# 2. Install dependencies
npm install

# 3. Create encryption key
openssl rand -hex 16

# 4. Configure environment
cat > .env.local << EOF
NEXT_PUBLIC_IRCTC_API_BASE=https://www.irctc.co.in/nget/tatkalapi
NEXT_PUBLIC_BOOKING_WINDOW_TIME=11:00:00
ENCRYPTION_KEY=<paste_your_key_here>
NEXT_PUBLIC_TIMEOUT=5000
NEXT_PUBLIC_MAX_RETRIES=3
EOF

# 5. Start development
npm run dev
```

Visit `http://localhost:3000`

## Development Workflow

### Code Organization

```
src/
├── app/              # Next.js pages & layouts
├── components/       # React components
├── lib/             # Utilities & services
└── store/           # State management
```

### Adding a New Feature

1. **Create component if needed** in `src/components/`
2. **Add state** in `src/store/` if needed
3. **Add utilities** in `src/lib/` if needed
4. **Use in pages** in `src/app/`

Example:

```typescript
// 1. Create component: src/components/MyComponent.tsx
export default function MyComponent() {
  return <div>My Component</div>;
}

// 2. Use in page: src/app/mypage/page.tsx
import MyComponent from '@/components/MyComponent';

export default function MyPage() {
  return <MyComponent />;
}
```

### Component Best Practices

```typescript
// Use 'use client' for interactive components
'use client';

import { useState } from 'react';

interface Props {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState(false);

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

## State Management with Zustand

### Creating a Store

```typescript
// src/store/my-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (value) => set({ value }),
    }),
    {
      name: 'my-storage',
    }
  )
);
```

### Using the Store

```typescript
'use client';

import { useMyStore } from '@/store/my-store';

export default function Component() {
  const { value, setValue } = useMyStore();

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

## API Integration

### Making API Calls

```typescript
// Using the existing API client
import { apiClient } from '@/lib/api-client';

// Login
const result = await apiClient.login(username, password);

// Search trains
const trains = await apiClient.getTrains(from, to, date, classType);

// Book ticket
const booking = await apiClient.bookTicket(
  trainNumber,
  from,
  to,
  date,
  passengers
);
```

### Adding New API Endpoints

```typescript
// In src/lib/api-client.ts
async getNewData(param: string) {
  try {
    const response = await this.client.post('/endpoint', {
      param,
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Form Validation

### Using Zod Schemas

```typescript
import { zod } from 'zod';

// Define schema
const FormSchema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().int().min(0).max(120),
});

// Type inference
type FormData = z.infer<typeof FormSchema>;

// Validation
try {
  const validated = FormSchema.parse(data);
} catch (error) {
  console.error('Validation failed:', error);
}
```

## Styling

### Tailwind CSS

```tsx
<div className='flex gap-4 p-6 bg-white rounded-lg shadow-lg'>
  <div className='flex-1'>Content</div>
  <button className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'>
    Click me
  </button>
</div>
```

### Custom Colors

Colors are defined in `tailwind.config.ts`:
- `primary`: #FF6B35 (Orange)
- `secondary`: #004E89 (Blue)
- `success`: #06D6A0 (Green)
- `warning`: #FFD166 (Yellow)
- `danger`: #EF476F (Red)

## Testing

### Running Type Check

```bash
npm run type-check
```

### Running Linter

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

## Debugging

### Browser DevTools

1. Open `http://localhost:3000`
2. Press `F12` to open DevTools
3. Check Console for errors
4. Check Network tab for API calls

### VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "runtimeVersion": "18",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Console Logging

```typescript
// Log store state
console.log('Auth state:', useAuthStore.getState());
console.log('Booking state:', useBookingStore.getState());

// Log API calls
axios.interceptors.request.use((config) => {
  console.log('API:', config.method?.toUpperCase(), config.url);
  return config;
});
```

## Performance Monitoring

### Lighthouse Audit

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Generate report"

### Bundle Analysis

```bash
npm install -D @next/bundle-analyzer
```

Update `next.config.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

Run:

```bash
ANALYZE=true npm run build
```

## Git Workflow

### Commit Messages

Follow conventional commits:

```
feat: Add new feature
fix: Fix a bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Maintenance
```

Example:

```bash
git commit -m "feat: Add booking status tracking"
```

### Branch Naming

```
feature/feature-name
bugfix/bug-name
refactor/refactor-name
docs/doc-name
```

Example:

```bash
git checkout -b feature/multi-language-support
```

## Environment Variables

### Development (.env.local)

```env
NEXT_PUBLIC_IRCTC_API_BASE=http://localhost:3001/api
ENCRYPTION_KEY=dev_key_not_secure
NEXT_PUBLIC_TIMEOUT=5000
NEXT_PUBLIC_MAX_RETRIES=3
```

### Production (Vercel/Hosting)

Set via admin panel or environment variables interface.

Never commit `.env.local` - it's in `.gitignore`

## Troubleshooting

### "Module not found" error

```bash
npm install
```

### TypeScript errors

```bash
npm run type-check
```

### Port 3000 already in use

```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Build fails

```bash
rm -rf .next node_modules
npm install
npm run build
```

## Code Style Guide

### Function Components

```typescript
'use client'; // Add if interactive

interface Props {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: Props) {
  const [state, setState] = useState('');

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
}
```

### File Organization

```typescript
// Imports
import { useEffect, useState } from 'react';

// Component
export default function MyComponent() {
  // State
  const [count, setCount] = useState(0);

  // Effects
  useEffect(() => {}, []);

  // Handlers
  const handleClick = () => {};

  // Render
  return <div onClick={handleClick}>{count}</div>;
}
```

### Error Handling

```typescript
try {
  await apiClient.login(username, password);
} catch (error) {
  if (error instanceof ZodError) {
    setError(error.errors[0].message);
  } else {
    setError('An error occurred');
  }
}
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://zustand-demo.vercel.app/)
- [Zod Docs](https://zod.dev/)

## Getting Help

1. Check documentation files (SETUP.md, FEATURES.md, etc.)
2. Review related code examples in the project
3. Check GitHub issues
4. Open a new issue with detailed information

## Performance Tips for Development

- Close unused browser tabs
- Use Chrome/Firefox (better dev tools)
- Disable browser extensions
- Use wired internet connection
- Keep VS Code extensions minimal

---

**Happy coding! 🚀**

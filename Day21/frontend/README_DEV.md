# Frontend Setup & Development Guide

## Overview

The frontend is built with **Next.js**, **React**, and **Socket.IO Client** to provide a real-time comment interface.

## Quick Start

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:3001 (or next available port)
```

## Project Structure

```
app/
├── Comments.tsx        # Main comments component
├── Notification.tsx    # Toast notification component
├── page.tsx           # Home page
├── globals.css        # Global styles
└── layout.tsx         # Root layout template

lib/
├── useSocket.ts       # Custom Socket.IO hook
└── types.ts          # TypeScript interfaces

public/               # Static assets
```

## Available Scripts

```bash
# Development
npm run dev           # Start development server with hot reload

# Production
npm run build         # Build for production
npm start            # Start production server

# Other
npm run lint         # Run ESLint (if configured)
npm test             # Run tests (if configured)
```

## Components

### Comments Component
**File:** `app/Comments.tsx`

Main component that:
- Manages comment form state (author, text)
- Displays list of comments
- Handles form submission
- Listens for real-time updates
- Manages notifications

**Key State:**
- `author`: Current user name
- `text`: Current comment text
- `comments`: Array of all comments
- `notifications`: Active toast notifications
- `isConnected`: Connection status

### Notification Component
**File:** `app/Notification.tsx`

Displays toast notifications:
- Auto-dismiss after 5 seconds
- Slide in animation
- Color-coded by type
- Smooth fade out

### useSocket Hook
**File:** `lib/useSocket.ts`

Custom React hook for Socket.IO connection:
- Initializes WebSocket connection
- Handles connection/disconnection
- Provides `emit()`, `on()`, `off()` methods
- Auto-reconnects on disconnect

**Usage:**
```typescript
const { socket, isConnected, emit, on, off } = useSocket();

// Emit event
emit('add_comment', { author: 'Alice', text: 'Hello!' });

// Listen for events
on('new_comment', (comment) => {
  console.log('New comment:', comment);
});

// Stop listening
off('new_comment', handler);
```

## Socket.IO Connection

**Server URL:** `http://localhost:3000`

Configurable in `lib/useSocket.ts`:
```typescript
const SOCKET_URL = 'http://localhost:3000';
```

**Connection Options:**
```typescript
{
  reconnection: true,           // Auto-reconnect
  reconnectionDelay: 1000,      // Wait 1s before retry
  reconnectionDelayMax: 5000,   // Max 5s between retries
  reconnectionAttempts: 5       // Try 5 times max
}
```

## Event Handling

### Listening for Events
```typescript
// Load initial comments
on('load_comments', (comments) => {
  setComments(comments);
});

// Receive new comment
on('new_comment', (comment) => {
  setComments((prev) => [...prev, comment]);
});

// Receive notification
on('notification', (notification) => {
  // Show toast
});
```

### Emitting Events
```typescript
// Send new comment
emit('add_comment', {
  author: 'John',
  text: 'Great discussion!'
});
```

## Styling

**Framework:** Tailwind CSS

**Key Classes:**
- `bg-gradient-to-br` - Background gradient
- `shadow-lg` - Drop shadow
- `rounded-lg` - Rounded corners
- `animate-fade-in-down` - Custom animation

**Custom Animation:** `globals.css`
```css
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}
```

## TypeScript Types

**File:** `lib/types.ts`

```typescript
interface Comment {
  id: string;              // Unique ID
  author: string;          // Commenter name
  text: string;           // Comment content
  timestamp: Date | string; // When posted
}

interface Notification {
  message: string;        // Notification text
  type: string;          // 'comment', 'error', etc.
  timestamp: Date | string;
}
```

## Performance Optimization

### Lazy Loading
Comments are loaded incrementally as new ones arrive.

### Debouncing
Form submission is throttled to prevent duplicate submissions.

### Memoization
Consider wrapping components with `React.memo()` for lists:
```typescript
const CommentItem = React.memo(({ comment }) => (
  // Component code
));
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Debugging

### Browser DevTools

1. **Network Tab**: 
   - WS connections show WebSocket communication
   - Check for successful handshake

2. **Console Tab**:
   - Socket.IO logs connections
   - Check for errors

3. **Application Tab**:
   - No localStorage used currently
   - No cookies to manage

### React Developer Tools
Install React DevTools extension to inspect component state.

## Environment Variables

Currently no `.env` files needed. To add:

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Use in code:
```typescript
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

## Testing

### Manual Testing Steps

1. **Connection Test**
   - Load page
   - Check "🟢 Connected" status
   - Opens DevTools → Network → WS
   - Should see Socket.IO connection

2. **Comment Test**
   - Enter name and comment
   - Click "Post Comment"
   - Comment appears in list
   - Timestamp displays correctly

3. **Broadcast Test**
   - Open second browser tab
   - Post comment in first tab
   - Verify it appears in second tab
   - Check notification appears

4. **Notification Test**
   - Open two browser windows
   - Post in first window
   - Notification should appear in second (not first)
   - Should auto-dismiss after 5 seconds

## Deployment

### Deploy to Vercel

```bash
# Push code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Import repository in Vercel dashboard
# Set environment variables if needed
# Deploy with one click
```

### Deploy to Netlify

```bash
# Build locally
npm run build

# Deploy
npm run deploy
```

### Environment for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Common Issues

### Issue: "Cannot connect to server"
**Solution:**
- Verify backend is running: `curl http://localhost:3000`
- Check CORS settings in backend
- Check browser console for errors

### Issue: "Comments not updating in real-time"
**Solution:**
- Check WebSocket connection (Network tab)
- Verify Socket.IO event listener setup
- Check backend logs for broadcast errors

### Issue: "Styling looks broken"
**Solution:**
```bash
# Rebuild Tailwind CSS
npm run build
```

### Issue: "Hot reload not working"
**Solution:**
```bash
npm run dev
# File changes should auto-reload
# If not, stop and restart npm run dev
```

## Code Structure Best Practices

### Component Organization
```
Frontend/
├── app/              # Page components
├── components/       # Reusable components
├── lib/              # Utilities & hooks
└── styles/           # Global styles
```

### State Management
Current: React hooks (useState)
For larger apps, consider:
- Redux
- Zustand
- Context API

### API Communication
Currently: Direct Socket.IO
For REST APIs:
```typescript
const response = await fetch('/api/comments');
```

## Future Enhancements

- [ ] User authentication
- [ ] Persistent storage
- [ ] Comment editing
- [ ] Comment deletion
- [ ] Reactions/Emojis
- [ ] Rich text editor
- [ ] File uploads
- [ ] Typing indicators
- [ ] Direct messages
- [ ] Comment search

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**Happy coding! 🚀**

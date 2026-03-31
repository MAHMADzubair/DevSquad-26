# QUICK START GUIDE

Get the entire system running in less than 2 minutes!

## Prerequisites
- Node.js (v18+)
- npm (v9+)
- Two terminal windows

## Step 1: Start Backend (Terminal 1)

```bash
cd Day20/backend
npm install          # First time only
npm run start:dev
```

**Expected output:**
```
[Nest] XX/XX/XXXX LOG [NestFactory] Starting Nest application...
Server running on http://localhost:3000
```

✅ Backend ready!

## Step 2: Start Frontend (Terminal 2)

```bash
cd Day20/frontend
npm install          # First time only
npm run dev
```

**Expected output:**
```
> frontend@0.1.0 dev
  ▲ Next.js 16.2.1
  Local:        http://localhost:3001
```

✅ Frontend ready!

## Step 3: Open the App

Open in your browser:
```
http://localhost:3001
```

You should see:
- ✅ "🟢 Connected" status
- 💬 Comment form (author + text)
- 📝 Comments list (empty initially)

## Step 4: Test Real-Time Comments

1. **Open second browser tab** with same URL: `http://localhost:3001`
2. **In Tab 1**: 
   - Enter name: "Alice"
   - Enter comment: "Hello world!"
   - Click "Post Comment"
3. **In Tab 2**: 
   - You should see "Alice" posted comment instantly! 🎉
   - Toast notification appears: "Alice posted a new comment"

4. **In Tab 2**:
   - Enter name: "Bob"
   - Enter comment: "Hi Alice!"
   - Click "Post Comment"
5. **In Tab 1**:
   - You see Bob's comment instantly
   - Toast notification appears

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `PORT=3001 npm run start:dev` |
| Port 3001 in use | `npm run dev -- -p 3002` |
| No real-time updates | Check connection status (should be 🟢) |
| Comments not appearing | Refresh page or restart backend |

## Architecture at a Glance

```
You (Browser)
    ↓ HTTP
Next.js (localhost:3001)
    ↓ WebSocket
NestJS Server (localhost:3000)
    └─ Stores Comments in Memory
```

## What's Happening

1. **Connection**: Frontend connects to backend via Socket.IO
2. **Load Comments**: Backend sends all existing comments to frontend
3. **Add Comment**: Frontend emits comment, backend broadcasts to all
4. **Notification**: All other clients get notified

## Key Files

- **Backend**: `backend/src/comments/`
  - `comments.gateway.ts` - WebSocket handler
  - `comments.service.ts` - Comment storage
  
- **Frontend**: `frontend/app/`
  - `Comments.tsx` - Main UI component
  - `Notification.tsx` - Toast notifications
  - `lib/useSocket.ts` - Socket.IO hook

## Next Steps

1. Read [README.md](./README.md) for detailed documentation
2. Read [backend/README_DEV.md](./backend/README_DEV.md) for backend details
3. Explore the code - it's well-commented!
4. Try deploying to Vercel or Heroku

---

**You now have a fully functional real-time comment system! 🚀**

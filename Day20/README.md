# 🚀 Real-Time Comment & Notification System with Socket.IO

A complete full-stack real-time comment system built with **NestJS + Socket.IO** (backend) and **Next.js + Socket.IO Client** (frontend). All connected users see new comments instantly without needing to refresh the page.

## ✨ Features

- ✅ **Real-Time Comments**: All connected users see new comments instantly via Socket.IO
- ✅ **Toast Notifications**: Users receive notifications when others post comments
- ✅ **Connection Status**: Visual indicator showing if clients are connected to the server
- ✅ **Responsive UI**: Beautiful, modern interface with Tailwind CSS
- ✅ **In-Memory Storage**: Comments persist during server lifetime
- ✅ **Type-Safe**: Full TypeScript support on both frontend and backend
- ✅ **CORS Enabled**: Secure cross-origin communication

## 📁 Project Structure

```
Day20/
├── backend/                 # NestJS + Socket.IO server
│   ├── src/
│   │   ├── comments/
│   │   │   ├── comments.gateway.ts    # WebSocket event handlers
│   │   │   ├── comments.service.ts    # Comment business logic
│   │   │   └── comments.module.ts     # Module definition
│   │   ├── app.module.ts              # Main app module
│   │   └── main.ts                    # Server entry point
│   └── package.json
│
└── frontend/                # Next.js client app
    ├── app/
    │   ├── Comments.tsx       # Main comments component
    │   ├── Notification.tsx   # Toast notification component
    │   ├── page.tsx          # Home page
    │   └── globals.css       # Global styles with animations
    ├── lib/
    │   ├── useSocket.ts      # Socket.IO hook
    │   └── types.ts          # TypeScript interfaces
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **NestJS** - Node.js progressive framework
- **Socket.IO** - Real-time bidirectional communication
- **TypeScript** - Type-safe development
- **Express** - HTTP server

### Frontend
- **Next.js** - React framework for production
- **React** - UI library
- **Socket.IO Client** - WebSocket client library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone/Setup the Project

```bash
# Navigate to the project directory
cd Day20
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (should be already done)
npm install

# Start the development server
npm run start:dev
```

The backend will run on `http://localhost:3000`

**Output:**
```
[Nest] XX/XX/XXXX, X:XX:XX AM     LOG [NestFactory] Starting Nest application...
[Nest] XX/XX/XXXX, X:XX:XX AM     LOG [InstanceLoader] CommentsModule dependencies initialized
Server running on http://localhost:3000
```

### 3. Frontend Setup (in a new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies (should be already done)
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000` (Next.js will use 3001 if 3000 is taken)

**Output:**
```
> frontend@0.1.0 dev
> next dev

  ▲ Next.js 16.2.1 (Turbopack)

  Local:        http://localhost:3001
```

### 4. Open the Application

Open `http://localhost:3001` in your browser (or the port Next.js assigns).

## 💬 How to Use

1. **Enter Your Name**: Type your name in the "Your Name" field
2. **Write a Comment**: Type your comment in the text area
3. **Click "Post Comment"**: Submit your comment
4. **See Updates in Real-Time**: 
   - Your comment appears immediately in the comments list
   - All other connected users see it instantly
   - Each client receives a notification when someone else posts

## 🔌 Socket.IO Events

### Backend → Frontend (Emit)
- **`load_comments`**: Sends all existing comments when a client connects
- **`new_comment`**: Broadcasts a new comment to all connected clients
- **`notification`**: Sends a notification to all clients except the poster

### Frontend → Backend (Emit)
- **`add_comment`**: Sends a new comment with author and text
- **`get_comments`**: Requests the current list of comments

## 🏗️ Architecture

### Backend Architecture

```
CommentsGateway
├── @WebSocketGateway() - Listens on WebSocket connections
├── handleConnection() - New client connected
├── handleDisconnect() - Client disconnected
├── handleAddComment() - Process new comment
└── handleGetComments() - Return all comments

CommentsService
├── addComment() - Add new comment to storage
├── getComments() - Get all comments
├── deleteComment() - Remove a comment
└── getCommentById() - Find specific comment
```

### Frontend Architecture

```
useSocket Hook
├── Create Socket.IO connection
├── emit() - Send events to server
├── on() - Listen for server events
└── off() - Unsubscribe from events

Comments Component
├── Load comments on connect
├── Handle form submission
├── Display comments list
├── Receive new comments in real-time
└── Show notifications

Notification Component
├── Display toast message
├── Auto-hide after 5 seconds
└── Animate in/out
```

## 📊 Data Flow

```
┌─────────────────────────┐
│   User Opens Website    │
│   http://localhost:3001 │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Socket.IO Connection Established
│  (to http://localhost:3000) │
└────────────┬────────────────┘
             │
             ▼
┌──────────────────────────────┐
│ Server Sends All Existing    │
│ Comments (load_comments)     │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│ User Types Comment & Clicks Post │
└────────────┬─────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Frontend Emits (add_comment) Event  │
│ with author and text                │
└────────────┬────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│ Backend Receives add_comment Event     │
│ Creates new Comment with timestamp     │
│ Stores in memory array                 │
└────────────┬───────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Backend Emits (new_comment) to ALL      │
│ Connected Clients with comment data      │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Backend Emits (notification) to ALL     │
│ Except Poster - shows toast message     │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ All Connected Users See New Comment  │
│ & Non-Posters See Toast Notification│
└──────────────────────────────────────┘
```

## 🔐 CORS Configuration

The backend is configured to accept connections from:
```typescript
cors: {
  origin: 'http://localhost:3001',
  credentials: true,
}
```

To allow other origins, modify in `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:3001', 'http://yourdomain.com'],
  credentials: true,
});
```

## 📝 API Reference

### Comment Interface
```typescript
interface Comment {
  id: string;              // Unique identifier
  author: string;          // Comment author name
  text: string;           // Comment content
  timestamp: Date;        // Creation timestamp
}
```

### Notification Interface
```typescript
interface Notification {
  message: string;        // Notification text
  type: string;          // Type: 'comment', 'error', etc.
  timestamp: Date;       // Creation timestamp
}
```

## 🧪 Testing

### Manual Testing

1. **Open multiple browser tabs/windows** to the frontend URL
2. **Post a comment** in one tab
3. **Observe** it appears instantly in all other tabs
4. **Check** notification toast appears in non-posting tabs
5. **Refresh** a tab and see all comments are still there (in-memory storage)

### Connection Testing

- Look for the connection status indicator (🟢 Connected / 🔴 Disconnected)
- If backend is down, frontend shows "🔴 Disconnected"
- When backend reconnects, status updates automatically

## 🐛 Troubleshooting

### Problem: "Cannot connect to server"
**Solution:** 
- Ensure backend is running on port 3000
- Check browser console for error messages
- Verify CORS origin matches frontend URL

### Problem: Comments not appearing
**Solution:**
- Check browser console for errors
- Verify WebSocket connection is established (Network tab in DevTools)
- Check backend logs for error messages

### Problem: Port already in use
**Solution:**
```bash
# Backend on different port
PORT=3001 npm run start:dev

# Frontend on different port
npm run dev -- -p 3002
```

## 📚 Learning Resources

- [Socket.IO Official Documentation](https://socket.io/docs/v4/)
- [Socket.IO Tutorial](https://socket.io/docs/v4/tutorial/introduction)
- [NestJS WebSocket Guide](https://docs.nestjs.com/websockets/gateways)
- [Next.js Documentation](https://nextjs.org/docs)

## 🚢 Deployment

### Backend Deployment (Vercel, Heroku, DigitalOcean)
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Frontend Deployment (Vercel)
```bash
# Vercel automatically detects Next.js projects
# Just connect your GitHub repo to Vercel dashboard
```

## 📈 Future Enhancements

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] User authentication and profiles
- [ ] Edit/Delete comments functionality
- [ ] Direct messaging between users
- [ ] Typing indicators ("User is typing...")
- [ ] Comment reactions/emojis
- [ ] Message persistence across server restarts
- [ ] User avatars and profiles
- [ ] Comment threading/replies
- [ ] Message search functionality

## 📄 License

MIT

## 👨‍💻 Author

Created as a learning project to understand real-time communication with Socket.IO

---

## 🎯 Key Concepts Learned

✅ **WebSocket Communication**: Real-time bidirectional communication between client and server

✅ **Event-Driven Architecture**: Backend emits events that clients listen to

✅ **Socket.IO Broadcasting**: Sending messages to all or specific clients

✅ **Connection Management**: Handling connections, disconnections, and reconnections

✅ **State Management**: Maintaining comment list state in React components

✅ **TypeScript**: Type-safe development for better code quality

✅ **NestJS Gateways**: Creating WebSocket handlers in NestJS

✅ **React Hooks**: Custom hooks for managing Socket.IO connections

---

**Happy Real-Time Commenting! 🎉**

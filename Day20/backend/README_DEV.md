# Backend Setup & Development Guide

## Overview

The backend is built with **NestJS** and **Socket.IO** to handle real-time WebSocket connections for the comment system.

## Quick Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server with hot reload
npm run start:dev

# Backend will run on http://localhost:3000
```

## Project Structure

```
src/
├── comments/
│   ├── comments.gateway.ts      # WebSocket event handlers
│   ├── comments.service.ts      # Comment business logic
│   └── comments.module.ts       # Module definition
├── app.controller.ts            # HTTP routes (if needed)
├── app.service.ts              # App-level business logic
├── app.module.ts               # Root module
└── main.ts                     # Application entry point

test/                           # E2E tests
```

## Available Scripts

```bash
# Development
npm run start              # Start the application
npm run start:dev          # Start with watch mode (hot reload)
npm run start:debug        # Start with debugging enabled

# Production
npm run build             # Build for production
npm run start:prod        # Run production build

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests with watch mode
npm run test:cov          # Run tests with coverage report
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## Socket.IO Gateway

### CommentsGateway

The main gateway that handles all WebSocket connections and events.

**File:** `src/comments/comments.gateway.ts`

**Features:**
- Listens for incoming WebSocket connections
- Tracks connected clients
- Handles comment submission events
- Broadcasts new comments to all clients
- Sends notifications to clients

**Lifecycle Hooks:**
- `handleConnection(client)`: Called when a client connects - sends all existing comments
- `handleDisconnect(client)`: Called when a client disconnects

**Event Handlers:**
- `@SubscribeMessage('add_comment')`: Receives new comment and broadcasts to all
- `@SubscribeMessage('get_comments')`: Returns all stored comments

### CommentsService

Manages the in-memory storage of comments.

**File:** `src/comments/comments.service.ts`

**Methods:**
- `addComment(data)`: Create and store a new comment
- `getComments()`: Return all comments
- `deleteComment(id)`: Remove a comment by ID
- `getCommentById(id)`: Find a specific comment

## Environment Variables

Currently, the backend uses a default PORT of `3000`. To change it:

```bash
PORT=3001 npm run start:dev
```

## CORS Configuration

The backend accepts connections from `http://localhost:3001` by default. To modify:

**File:** `src/main.ts`

```typescript
app.enableCors({
  origin: ['http://localhost:3001', 'http://other-domain.com'],
  credentials: true,
});
```

## Data Storage

Comments are stored in an **in-memory array** in the `CommentsService`. This means:
- ✅ Comments persist during the server session
- ❌ Comments are lost when the server restarts
- ⏱️ Perfect for development and testing

**To add database persistence**, replace the array with a database query (MongoDB, PostgreSQL, etc.)

## WebSocket Event Flow

### Incoming Events (from client)
```
Client → add_comment (author, text)
         └─> Server processes and stores
Collection happens in CommentsService
```

### Outgoing Events (to client)
```
Server → new_comment (complete comment object)
         └─> All connected clients receive
        
         notification (message, type)
         └─> All clients EXCEPT poster receive
         
         load_comments (array of comments)
         └─> New connection receives all existing comments
```

## Debug Mode

Start the backend with debugging:

```bash
npm run start:debug

# Backend will be available at: http://localhost:9229
# Use Chrome DevTools or VS Code Debugger to connect
```

## Testing

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

## Production Build

```bash
# Build
npm run build
# Output: dist/ folder

# Run production build
npm run start:prod
```

## Common Issues

### Issue: "Cannot find module '@nestjs/websockets'"
**Solution:**
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

### Issue: "Port 3000 is already in use"
**Solution:**
```bash
# Use a different port
PORT=3001 npm run start:dev
```

### Issue: "WebSocket connection failed"
**Solution:**
- Check frontend CORS settings match the frontend URL
- Verify backend is running on the correct port
- Check browser console for specific error messages

## Performance Tips

1. **Limit Comments**: Implement pagination for large comment lists
2. **Memory Management**: Add database persistence to avoid storing all comments in RAM
3. **Connection Pooling**: Use connection pools if using a database
4. **Caching**: Cache frequently accessed comments

## Monitoring

To monitor connections and events, add logging:

```typescript
@WebSocketGateway()
export class CommentsGateway {
  private logger = new Logger('CommentsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
```

## Next Steps

1. **Add Database**: Connect MongoDB or PostgreSQL
2. **User Authentication**: Implement JWT-based auth
3. **Comment Moderation**: Add spam filtering
4. **Persistence**: Save comments to a database
5. **Metrics**: Track engagement and active users

---

**Happy developing! 🚀**

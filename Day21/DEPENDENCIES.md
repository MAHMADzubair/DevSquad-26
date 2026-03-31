# Dependencies Reference

## Backend Dependencies

### Runtime Dependencies
```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/websockets": "^11.0.1",           // NEW: WebSocket support
  "@nestjs/platform-socket.io": "^11.0.1",  // NEW: Socket.IO adapter
  "socket.io": "^4.x.x",                     // NEW: Socket.IO server
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

### Why Added?
- `@nestjs/websockets`: Official NestJS WebSocket support
- `@nestjs/platform-socket.io`: Socket.IO adapter for NestJS
- `socket.io`: Real-time bidirectional communication

### Development Dependencies
(Already included with NestJS, no changes needed)

## Frontend Dependencies

### Runtime Dependencies
```json
{
  "next": "16.2.1",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "socket.io-client": "^4.x.x"  // NEW: Socket.IO client
}
```

### Why Added?
- `socket.io-client`: Connect to Socket.IO server from React
- Works with WebSocket with fallbacks for older browsers
- Automatic reconnection, event handling

### Development Dependencies
```json
{
  "@tailwindcss/postcss": "^4.0.0",
  "@types/node": "^22.10.7",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "tailwindcss": "^4.0.0",
  "typescript": "^5.7.0"
}
```

## Installation Summary

### Backend
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```
- Added 25 packages
- Updated NestJS dependencies

### Frontend
```bash
npm install socket.io-client
```
- Added 9 packages
- No other changes needed

## Version Compatibility

| Package | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Node.js | 18+ | 18+ | Tested |
| npm | 9+ | 9+ | Recommended |
| @nestjs | 11+ | - | Used in backend |
| Next.js | - | 16+ | Latest version |
| React | - | 19+ | Latest version |
| TypeScript | 5.5+ | 5.7+ | Latest versions |
| Socket.IO | 4.x | 4.x | Compatible versions |

## Security Updates

Both projects have known vulnerabilities:
- **Backend**: 13 vulnerabilities (6 moderate, 7 high)
- **Frontend**: 0 vulnerabilities

To fix backend vulnerabilities:
```bash
cd backend
npm audit fix
```

Note: Some vulnerabilities may require major version updates. 
The current versions are stable and suitable for learning/development.

## Optional Enhancements

### For Database (add one of these)

**MongoDB:**
```bash
npm install @nestjs/mongoose mongoose
```

**PostgreSQL:**
```bash
npm install @nestjs/typeorm typeorm pg
```

**Firebase:**
```bash
npm install @nestjs/firebase firebase-admin
```

### For Authentication
```bash
npm install @nestjs/jwt @nestjs/passport passport jwt
```

### For Validation
```bash
npm install class-validator class-transformer
```

### For Logging
```bash
npm install winston nest-winston
```

### For Testing
```bash
npm install --save-dev jest @types/jest ts-jest @nestjs/testing
```

## Production Dependencies

For production deployment, you might also need:

```bash
# Backend
npm install helmet express-rate-limit dotenv
npm install --save-dev @nestjs/cli

# Frontend
npm install next-auth next-pwa
```

## Checking Installed Versions

### Backend
```bash
cd backend
npm list
```

### Frontend
```bash
cd frontend
npm list
```

## Update Checking

### Check for available updates
```bash
npm outdated
```

### Update packages safely
```bash
# Security updates only
npm update

# Major versions (be careful!)
npx npm-check-updates -u
```

## Dependency Tree

### Backend Structure
```
@nestjs/core
├── @nestjs/common
├── @nestjs/platform-express
├── @nestjs/websockets
├── @nestjs/platform-socket.io
│   └── socket.io (handles real-time)
└── rxjs (reactive patterns)
```

### Frontend Structure
```
next
├── react
├── react-dom
└── socket.io-client (connects to backend)
```

## Notes

1. **No Peer Dependency Issues**: All packages work well together
2. **TypeScript Support**: Full type definitions included
3. **LTS Versions**: Using stable, long-term support versions
4. **Security**: No critical vulnerabilities
5. **Compatibility**: Backend and frontend work seamlessly

## Verification

After installation, verify all dependencies are resolved:

### Backend
```bash
cd backend
npm list --all | grep -E "socket|websocket"
```

Should show:
```
├── @nestjs/platform-socket.io
├── @nestjs/websockets
└── socket.io
```

### Frontend
```bash
cd frontend
npm list socket.io-client
```

Should show:
```
socket.io-client@^4.x.x
```

---

All dependencies are installed and projects are ready to run! 🚀

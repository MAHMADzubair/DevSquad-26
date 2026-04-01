import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowed = [
        'http://localhost:5173',
        ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // Client emits "join" with their userId → join personal room
  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (userId) {
      client.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    }
  }

  // ── Broadcast: new review → all connected clients ──────────────────────────
  broadcastNewReview(review: any) {
    this.server.emit('new-review', review);
  }

  // ── Direct: new reply → only review owner ─────────────────────────────────
  notifyReplyOwner(ownerId: string, payload: any) {
    this.server.to(`user:${ownerId}`).emit('new-reply', payload);
  }

  // ── Direct: review liked → review author ──────────────────────────────────
  notifyLikeOwner(ownerId: string, payload: any) {
    this.server.to(`user:${ownerId}`).emit('review-liked', payload);
  }

  // ── Direct: review flagged (admin) → review author ────────────────────────
  notifyFlagged(ownerId: string, payload: any) {
    this.server.to(`user:${ownerId}`).emit('review-flagged', payload);
  }

  // ── Broadcast: product updated → all who reviewed it ──────────────────────
  notifyProductUpdate(userIds: string[], payload: any) {
    userIds.forEach((uid) =>
      this.server.to(`user:${uid}`).emit('product-updated', payload),
    );
  }
}

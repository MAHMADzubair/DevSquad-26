import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/schemas/notification.schema';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map();
  private onlineUsers: Map<string, { username: string, userId: string }> = new Map();

  constructor(
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = client.handshake.query.userId as string;
    const username = client.handshake.query.username as string;
    
    if (userId && username) {
      this.userSockets.set(userId, client.id);
      this.onlineUsers.set(userId, { userId, username });
      // Broadcast updated online users to everyone
      this.server.emit('online_users', Array.from(this.onlineUsers.values()));
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        this.onlineUsers.delete(userId);
        // Broadcast updated online users to everyone
        this.server.emit('online_users', Array.from(this.onlineUsers.values()));
        break;
      }
    }
  }

  @SubscribeMessage('new_comment')
  async handleNewComment(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`📩 [Gateway] Received new_comment from ${client.id}:`, data);
    // ✅ Sab clients ko direct refresh signal bhejo
    this.server.emit('new_comment_posted', data);
    console.log(`📢 [Gateway] Broadcasted new_comment_posted`);
    // Notification bhi bhejo
    this.server.emit('notification', {
      type: NotificationType.COMMENT,
      message: `${data.senderName || 'Someone'} posted a new comment`,
      data: data,
    });
  }

  @SubscribeMessage('new_reply')
  async handleNewReply(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`📩 [Gateway] Received new_reply from ${client.id}:`, data);
    // ✅ Sab clients ko direct refresh signal bhejo (replies bhi global feed update kar sakti hain)
    this.server.emit('new_comment_posted', data);
    
    // Specific user ko notification bhejo
    const recipientSocketId = this.userSockets.get(data.recipientId);
    if (recipientSocketId) {
      console.log(`📢 [Gateway] Sending notification to recipient: ${data.recipientId}`);
      this.server.to(recipientSocketId).emit('notification', {
        type: NotificationType.REPLY,
        message: `${data.senderName || 'Someone'} replied to your comment`,
        data: data,
      });
    }
  }

  @SubscribeMessage('new_like')
  async handleNewLike(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`📩 [Gateway] Received new_like from ${client.id}:`, data);
    const recipientSocketId = this.userSockets.get(data.recipientId);
    if (recipientSocketId) {
      console.log(`📢 [Gateway] Sending like notification to ${data.recipientId}`);
      this.server.to(recipientSocketId).emit('notification', {
        type: NotificationType.LIKE,
        message: 'Someone liked your comment',
        data: data,
      });
    }
  }

  // --- NEW FEATURES: Typing Indicator ---
  
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { username: string, commentId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to everyone except the sender
    client.broadcast.emit('user_typing', data);
  }

  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @MessageBody() data: { username: string, commentId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('user_stopped_typing', data);
  }

  // --- NEW FEATURES: Edit & Delete Sync ---

  @SubscribeMessage('edit_comment')
  handleEditComment(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('comment_edited', data);
  }

  @SubscribeMessage('delete_comment')
  handleDeleteComment(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit('comment_deleted', data);
  }
}

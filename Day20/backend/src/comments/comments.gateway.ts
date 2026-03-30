import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private commentsService: CommentsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send all existing comments to the newly connected client
    const comments = this.commentsService.getComments();
    client.emit('load_comments', comments);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('add_comment')
  handleAddComment(
    client: Socket,
    payload: { author: string; text: string },
  ) {
    if (!payload.author || !payload.text) {
      client.emit('error', 'Author and text are required');
      return;
    }

    const comment = this.commentsService.addComment({
      author: payload.author,
      text: payload.text,
    });

    // Emit to all connected clients
    this.server.emit('new_comment', comment);

    // Send a notification to all clients except the sender
    this.server.except(client.id).emit('notification', {
      message: `${payload.author} posted a new comment`,
      type: 'comment',
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('get_comments')
  handleGetComments(): any[] {
    return this.commentsService.getComments();
  }
}

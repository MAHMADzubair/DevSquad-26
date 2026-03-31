import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
import { NotificationService } from '../notification/notification.service';
export declare class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly commentsService;
    private readonly notificationService;
    server: Server;
    private userSockets;
    private onlineUsers;
    constructor(commentsService: CommentsService, notificationService: NotificationService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleNewComment(data: any, client: Socket): Promise<void>;
    handleNewReply(data: any, client: Socket): Promise<void>;
    handleNewLike(data: any, client: Socket): Promise<void>;
    handleTyping(data: {
        username: string;
        commentId?: string;
    }, client: Socket): void;
    handleStopTyping(data: {
        username: string;
        commentId?: string;
    }, client: Socket): void;
    handleEditComment(data: any, client: Socket): void;
    handleDeleteComment(data: any, client: Socket): void;
}

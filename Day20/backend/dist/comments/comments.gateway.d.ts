import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommentsService } from './comments.service';
export declare class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private commentsService;
    server: Server;
    constructor(commentsService: CommentsService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAddComment(client: Socket, payload: {
        author: string;
        text: string;
    }): void;
    handleGetComments(): any[];
}

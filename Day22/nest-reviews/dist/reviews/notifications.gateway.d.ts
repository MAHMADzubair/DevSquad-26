import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(userId: string, client: Socket): void;
    broadcastNewReview(review: any): void;
    notifyReplyOwner(ownerId: string, payload: any): void;
    notifyLikeOwner(ownerId: string, payload: any): void;
    notifyFlagged(ownerId: string, payload: any): void;
    notifyProductUpdate(userIds: string[], payload: any): void;
}

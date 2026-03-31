"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const comments_service_1 = require("./comments.service");
const notification_service_1 = require("../notification/notification.service");
const notification_schema_1 = require("../notification/schemas/notification.schema");
let CommentsGateway = class CommentsGateway {
    commentsService;
    notificationService;
    server;
    userSockets = new Map();
    onlineUsers = new Map();
    constructor(commentsService, notificationService) {
        this.commentsService = commentsService;
        this.notificationService = notificationService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        const userId = client.handshake.query.userId;
        const username = client.handshake.query.username;
        if (userId && username) {
            this.userSockets.set(userId, client.id);
            this.onlineUsers.set(userId, { userId, username });
            this.server.emit('online_users', Array.from(this.onlineUsers.values()));
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                this.onlineUsers.delete(userId);
                this.server.emit('online_users', Array.from(this.onlineUsers.values()));
                break;
            }
        }
    }
    async handleNewComment(data, client) {
        this.server.emit('notification', {
            type: notification_schema_1.NotificationType.COMMENT,
            message: 'Someone posted a new comment',
            data: data,
        });
    }
    async handleNewReply(data) {
        const recipientSocketId = this.userSockets.get(data.recipientId);
        if (recipientSocketId) {
            this.server.to(recipientSocketId).emit('notification', {
                type: notification_schema_1.NotificationType.REPLY,
                message: 'Someone replied to your comment',
                data: data,
            });
        }
    }
    async handleNewLike(data) {
        const recipientSocketId = this.userSockets.get(data.recipientId);
        if (recipientSocketId) {
            this.server.to(recipientSocketId).emit('notification', {
                type: notification_schema_1.NotificationType.LIKE,
                message: 'Someone liked your comment',
                data: data,
            });
        }
    }
    handleTyping(data, client) {
        client.broadcast.emit('user_typing', data);
    }
    handleStopTyping(data, client) {
        client.broadcast.emit('user_stopped_typing', data);
    }
    handleEditComment(data, client) {
        client.broadcast.emit('comment_edited', data);
    }
    handleDeleteComment(data, client) {
        client.broadcast.emit('comment_deleted', data);
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CommentsGateway.prototype, "handleNewComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_reply'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsGateway.prototype, "handleNewReply", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_like'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentsGateway.prototype, "handleNewLike", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stop_typing'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleStopTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('edit_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleEditComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleDeleteComment", null);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        notification_service_1.NotificationService])
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map
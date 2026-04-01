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
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let NotificationsGateway = class NotificationsGateway {
    server;
    handleConnection(client) {
        console.log(`🔌 Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`❌ Client disconnected: ${client.id}`);
    }
    handleJoin(userId, client) {
        if (userId) {
            client.join(`user:${userId}`);
            console.log(`👤 User ${userId} joined their room`);
        }
    }
    broadcastNewReview(review) {
        this.server.emit('new-review', review);
    }
    notifyReplyOwner(ownerId, payload) {
        this.server.to(`user:${ownerId}`).emit('new-reply', payload);
    }
    notifyLikeOwner(ownerId, payload) {
        this.server.to(`user:${ownerId}`).emit('review-liked', payload);
    }
    notifyFlagged(ownerId, payload) {
        this.server.to(`user:${ownerId}`).emit('review-flagged', payload);
    }
    notifyProductUpdate(userIds, payload) {
        userIds.forEach((uid) => this.server.to(`user:${uid}`).emit('product-updated', payload));
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleJoin", null);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
            credentials: true,
        },
    })
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map
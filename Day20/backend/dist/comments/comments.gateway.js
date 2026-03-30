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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const comments_service_1 = require("./comments.service");
let CommentsGateway = class CommentsGateway {
    commentsService;
    server;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        const comments = this.commentsService.getComments();
        client.emit('load_comments', comments);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleAddComment(client, payload) {
        if (!payload.author || !payload.text) {
            client.emit('error', 'Author and text are required');
            return;
        }
        const comment = this.commentsService.addComment({
            author: payload.author,
            text: payload.text,
        });
        this.server.emit('new_comment', comment);
        this.server.except(client.id).emit('notification', {
            message: `${payload.author} posted a new comment`,
            type: 'comment',
            timestamp: new Date(),
        });
    }
    handleGetComments() {
        return this.commentsService.getComments();
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('add_comment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleAddComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_comments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], CommentsGateway.prototype, "handleGetComments", null);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3001',
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map
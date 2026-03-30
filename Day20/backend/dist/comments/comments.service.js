"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
let CommentsService = class CommentsService {
    comments = [];
    commentIdCounter = 1;
    addComment(data) {
        const comment = {
            id: `comment-${this.commentIdCounter++}`,
            author: data.author,
            text: data.text,
            timestamp: new Date(),
        };
        this.comments.push(comment);
        return comment;
    }
    getComments() {
        return this.comments;
    }
    deleteComment(id) {
        const index = this.comments.findIndex((c) => c.id === id);
        if (index > -1) {
            this.comments.splice(index, 1);
            return true;
        }
        return false;
    }
    getCommentById(id) {
        return this.comments.find((c) => c.id === id);
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)()
], CommentsService);
//# sourceMappingURL=comments.service.js.map
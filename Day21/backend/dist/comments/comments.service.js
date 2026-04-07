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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const user_schema_1 = require("../user/schemas/user.schema");
let CommentsService = class CommentsService {
    commentModel;
    userModel;
    constructor(commentModel, userModel) {
        this.commentModel = commentModel;
        this.userModel = userModel;
    }
    async create(data) {
        const comment = new this.commentModel({
            ...data,
            author: new mongoose_2.Types.ObjectId(data.author),
            parentComment: data.parentComment ? new mongoose_2.Types.ObjectId(data.parentComment) : null,
        });
        await this.userModel.findByIdAndUpdate(data.author, { $inc: { points: 5 } }).catch(() => { });
        return (await comment.save()).populate('author');
    }
    async getCommentsByPostId(postId) {
        return this.commentModel
            .find({ postId, parentComment: null })
            .populate('author')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getReplies(parentCommentId) {
        return this.commentModel
            .find({ parentComment: new mongoose_2.Types.ObjectId(parentCommentId) })
            .populate('author')
            .sort({ createdAt: 1 })
            .exec();
    }
    async toggleLike(commentId, userId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const index = comment.likes.findIndex((id) => id.equals(userObjectId));
        let isLiked = false;
        let pointsChange = 0;
        if (index > -1) {
            comment.likes.splice(index, 1);
            pointsChange = -2;
        }
        else {
            comment.likes.push(userObjectId);
            isLiked = true;
            pointsChange = 2;
        }
        await comment.save();
        if (comment.author.toString() !== userId) {
            await this.userModel.findByIdAndUpdate(comment.author, { $inc: { points: pointsChange } }).catch(() => { });
        }
        return { likes: comment.likes.length, isLiked };
    }
    async findById(id) {
        return this.commentModel.findById(id).populate('author').exec();
    }
    async editComment(id, userId, content) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.toString() !== userId)
            throw new common_1.UnauthorizedException('Not the author');
        comment.content = content;
        return (await comment.save()).populate('author');
    }
    async deleteComment(id, userId) {
        const comment = await this.commentModel.findById(id);
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.toString() !== userId)
            throw new common_1.UnauthorizedException('Not the author');
        await this.commentModel.deleteMany({ parentComment: new mongoose_2.Types.ObjectId(id) });
        await this.commentModel.findByIdAndDelete(id);
        await this.userModel.findByIdAndUpdate(userId, { $inc: { points: -5 } }).catch(() => { });
        return { success: true };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], CommentsService);
//# sourceMappingURL=comments.service.js.map
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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./review.schema");
let ReviewsService = class ReviewsService {
    reviewModel;
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    async getByProduct(productId) {
        return this.reviewModel
            .find({ productId: new mongoose_2.Types.ObjectId(productId) })
            .sort({ createdAt: -1 })
            .lean();
    }
    async create(dto) {
        const review = new this.reviewModel({
            productId: new mongoose_2.Types.ObjectId(dto.productId),
            authorId: new mongoose_2.Types.ObjectId(dto.authorId),
            authorName: dto.authorName,
            rating: dto.rating,
            body: dto.body,
        });
        return review.save();
    }
    async addReply(reviewId, dto) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        review.replies.push({
            authorId: new mongoose_2.Types.ObjectId(dto.authorId),
            authorName: dto.authorName,
            body: dto.body,
            createdAt: new Date(),
        });
        return review.save();
    }
    async toggleLike(reviewId, userId) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const uid = new mongoose_2.Types.ObjectId(userId);
        const alreadyLiked = review.likes.some((l) => l.equals(uid));
        if (alreadyLiked) {
            review.likes = review.likes.filter((l) => !l.equals(uid));
        }
        else {
            review.likes.push(uid);
        }
        return review.save();
    }
    async delete(reviewId) {
        const result = await this.reviewModel.findByIdAndDelete(reviewId);
        if (!result)
            throw new common_1.NotFoundException('Review not found');
    }
    async flag(reviewId) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        review.flagged = !review.flagged;
        return review.save();
    }
    async findById(reviewId) {
        return this.reviewModel.findById(reviewId).lean();
    }
    async notifyReviewers(productId, payload) {
        const reviewers = await this.reviewModel.find({ productId: new mongoose_2.Types.ObjectId(productId) }).distinct('authorId');
        const userIds = reviewers.map((id) => id.toString());
        if (userIds.length > 0) {
            payload.message = payload.message || 'A product you reviewed has been updated!';
        }
        return userIds;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map
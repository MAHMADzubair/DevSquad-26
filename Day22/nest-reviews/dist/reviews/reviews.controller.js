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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const notifications_gateway_1 = require("./notifications.gateway");
const review_dto_1 = require("./review.dto");
let ReviewsController = class ReviewsController {
    reviewsService;
    notificationsGateway;
    constructor(reviewsService, notificationsGateway) {
        this.reviewsService = reviewsService;
        this.notificationsGateway = notificationsGateway;
    }
    async getByProduct(productId) {
        const reviews = await this.reviewsService.getByProduct(productId);
        return { success: true, reviews };
    }
    async create(dto) {
        const review = await this.reviewsService.create(dto);
        this.notificationsGateway.broadcastNewReview({
            message: `${dto.authorName} posted a new review!`,
            review,
        });
        return { success: true, review };
    }
    async addReply(reviewId, dto) {
        const review = await this.reviewsService.addReply(reviewId, dto);
        const ownerId = review.authorId.toString();
        this.notificationsGateway.notifyReplyOwner(ownerId, {
            message: `${dto.authorName} replied to your review`,
            reviewId,
            reply: dto,
        });
        return { success: true, review };
    }
    async likeReview(reviewId, dto) {
        const review = await this.reviewsService.toggleLike(reviewId, dto.userId);
        const ownerId = review.authorId.toString();
        if (ownerId !== dto.userId) {
            this.notificationsGateway.notifyLikeOwner(ownerId, {
                message: 'Someone liked your review!',
                reviewId,
                likes: review.likes.length,
            });
        }
        return { success: true, review };
    }
    async delete(reviewId) {
        const review = await this.reviewsService.findById(reviewId);
        if (review) {
            const ownerId = review.authorId.toString();
            this.notificationsGateway.notifyFlagged(ownerId, {
                message: 'Your review was removed by an admin.',
                reviewId,
            });
        }
        await this.reviewsService.delete(reviewId);
        return { success: true, message: 'Review deleted' };
    }
    async flag(reviewId) {
        const review = await this.reviewsService.flag(reviewId);
        const ownerId = review.authorId.toString();
        this.notificationsGateway.notifyFlagged(ownerId, {
            message: review.flagged
                ? 'Your review has been flagged for moderation.'
                : 'Your review flag has been lifted.',
            reviewId,
            flagged: review.flagged,
        });
        return { success: true, review };
    }
    async notifyProductUpdate(body) {
        const userIds = await this.reviewsService.notifyReviewers(body.productId, body.changes);
        if (userIds && userIds.length > 0) {
            this.notificationsGateway.notifyProductUpdate(userIds, {
                message: `Product "${body.productName}" was just updated (price/stock)!`,
                productId: body.productId,
                changes: body.changes,
            });
        }
        return { success: true, notifiedCount: userIds?.length || 0 };
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)('product/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getByProduct", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':reviewId/reply'),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_dto_1.CreateReplyDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "addReply", null);
__decorate([
    (0, common_1.Post)(':reviewId/like'),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_dto_1.LikeReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "likeReview", null);
__decorate([
    (0, common_1.Delete)(':reviewId'),
    __param(0, (0, common_1.Param)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':reviewId/flag'),
    __param(0, (0, common_1.Param)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "flag", null);
__decorate([
    (0, common_1.Post)('notify-product-update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "notifyProductUpdate", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService,
        notifications_gateway_1.NotificationsGateway])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map
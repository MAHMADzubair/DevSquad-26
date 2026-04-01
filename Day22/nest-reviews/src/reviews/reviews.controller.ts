import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { NotificationsGateway } from './notifications.gateway';
import { CreateReviewDto, CreateReplyDto, LikeReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // GET /api/reviews/product/:productId
  @Get('product/:productId')
  async getByProduct(@Param('productId') productId: string) {
    const reviews = await this.reviewsService.getByProduct(productId);
    return { success: true, reviews };
  }

  // POST /api/reviews
  @Post()
  async create(@Body() dto: CreateReviewDto) {
    const review = await this.reviewsService.create(dto);

    // 🔴 Broadcast to ALL connected clients
    this.notificationsGateway.broadcastNewReview({
      message: `${dto.authorName} posted a new review!`,
      review,
    });

    return { success: true, review };
  }

  // POST /api/reviews/:reviewId/reply
  @Post(':reviewId/reply')
  async addReply(
    @Param('reviewId') reviewId: string,
    @Body() dto: CreateReplyDto,
  ) {
    const review = await this.reviewsService.addReply(reviewId, dto);

    // 🟡 Direct notify → review OWNER only
    const ownerId = review.authorId.toString();
    this.notificationsGateway.notifyReplyOwner(ownerId, {
      message: `${dto.authorName} replied to your review`,
      reviewId,
      reply: dto,
    });

    return { success: true, review };
  }

  // POST /api/reviews/:reviewId/like
  @Post(':reviewId/like')
  async likeReview(
    @Param('reviewId') reviewId: string,
    @Body() dto: LikeReviewDto,
  ) {
    const review = await this.reviewsService.toggleLike(reviewId, dto.userId);

    // 🟡 Direct notify → review AUTHOR only
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

  // DELETE /api/reviews/:reviewId  (admin)
  @Delete(':reviewId')
  async delete(@Param('reviewId') reviewId: string) {
    // Notify the author before deleting
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

  // PATCH /api/reviews/:reviewId/flag  (admin)
  @Patch(':reviewId/flag')
  async flag(@Param('reviewId') reviewId: string) {
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

  // POST /api/reviews/notify-product-update (Inter-service call)
  @Post('notify-product-update')
  async notifyProductUpdate(@Body() body: { productId: string; changes: any; productName: string }) {
    const userIds: any = await this.reviewsService.notifyReviewers(body.productId, body.changes);
    
    if (userIds && userIds.length > 0) {
      this.notificationsGateway.notifyProductUpdate(userIds, {
        message: `Product "${body.productName}" was just updated (price/stock)!`,
        productId: body.productId,
        changes: body.changes,
      });
    }

    return { success: true, notifiedCount: userIds?.length || 0 };
  }
}

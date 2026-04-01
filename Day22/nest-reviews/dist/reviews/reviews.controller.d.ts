import { ReviewsService } from './reviews.service';
import { NotificationsGateway } from './notifications.gateway';
import { CreateReviewDto, CreateReplyDto, LikeReviewDto } from './review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    private readonly notificationsGateway;
    constructor(reviewsService: ReviewsService, notificationsGateway: NotificationsGateway);
    getByProduct(productId: string): Promise<{
        success: boolean;
        reviews: import("./review.schema").ReviewDocument[];
    }>;
    create(dto: CreateReviewDto): Promise<{
        success: boolean;
        review: import("./review.schema").ReviewDocument;
    }>;
    addReply(reviewId: string, dto: CreateReplyDto): Promise<{
        success: boolean;
        review: import("./review.schema").ReviewDocument;
    }>;
    likeReview(reviewId: string, dto: LikeReviewDto): Promise<{
        success: boolean;
        review: import("./review.schema").ReviewDocument;
    }>;
    delete(reviewId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    flag(reviewId: string): Promise<{
        success: boolean;
        review: import("./review.schema").ReviewDocument;
    }>;
    notifyProductUpdate(body: {
        productId: string;
        changes: any;
        productName: string;
    }): Promise<{
        success: boolean;
        notifiedCount: any;
    }>;
}

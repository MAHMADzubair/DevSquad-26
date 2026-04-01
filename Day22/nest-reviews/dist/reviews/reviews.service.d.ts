import { Model } from 'mongoose';
import { ReviewDocument } from './review.schema';
import { CreateReviewDto, CreateReplyDto } from './review.dto';
export declare class ReviewsService {
    private reviewModel;
    constructor(reviewModel: Model<ReviewDocument>);
    getByProduct(productId: string): Promise<ReviewDocument[]>;
    create(dto: CreateReviewDto): Promise<ReviewDocument>;
    addReply(reviewId: string, dto: CreateReplyDto): Promise<ReviewDocument>;
    toggleLike(reviewId: string, userId: string): Promise<ReviewDocument>;
    delete(reviewId: string): Promise<void>;
    flag(reviewId: string): Promise<ReviewDocument>;
    findById(reviewId: string): Promise<ReviewDocument | null>;
    notifyReviewers(productId: string, payload: any): Promise<void>;
}

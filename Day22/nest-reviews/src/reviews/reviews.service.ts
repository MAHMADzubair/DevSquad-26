import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { CreateReviewDto, CreateReplyDto } from './review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  // ── Get all reviews for a product ──────────────────────────────────────────
  async getByProduct(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ productId: new Types.ObjectId(productId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  // ── Create a new review ────────────────────────────────────────────────────
  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    const review = new this.reviewModel({
      productId: new Types.ObjectId(dto.productId),
      authorId: new Types.ObjectId(dto.authorId),
      authorName: dto.authorName,
      rating: dto.rating,
      body: dto.body,
    });
    return review.save();
  }

  // ── Add reply to a review ──────────────────────────────────────────────────
  async addReply(
    reviewId: string,
    dto: CreateReplyDto,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    review.replies.push({
      authorId: new Types.ObjectId(dto.authorId),
      authorName: dto.authorName,
      body: dto.body,
      createdAt: new Date(),
    } as any);

    return review.save();
  }

  // ── Like / unlike a review ─────────────────────────────────────────────────
  async toggleLike(
    reviewId: string,
    userId: string,
  ): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    const uid = new Types.ObjectId(userId);
    const alreadyLiked = review.likes.some((l) => l.equals(uid));

    if (alreadyLiked) {
      review.likes = review.likes.filter((l) => !l.equals(uid));
    } else {
      review.likes.push(uid);
    }

    return review.save();
  }

  // ── Admin: delete a review ─────────────────────────────────────────────────
  async delete(reviewId: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(reviewId);
    if (!result) throw new NotFoundException('Review not found');
  }

  // ── Admin: flag a review ───────────────────────────────────────────────────
  async flag(reviewId: string): Promise<ReviewDocument> {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    review.flagged = !review.flagged;
    return review.save();
  }

  // ── Helper: get review by id (for owner lookup) ────────────────────────────
  async findById(reviewId: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findById(reviewId).lean();
  }

  // ── Notify product updates to all previous reviewers ───────────────────────
  async notifyReviewers(productId: string, payload: any): Promise<void> {
    const reviewers = await this.reviewModel.find({ productId: new Types.ObjectId(productId) }).distinct('authorId');
    const userIds = reviewers.map((id) => id.toString());
    if (userIds.length > 0) {
      payload.message = payload.message || 'A product you reviewed has been updated!';
      // To emit from service, we should ideally inject the gateway, but since controller injects both,
      // we can return the userIds to the controller and let it call the gateway.
    }
    return userIds as any; // Returing user array
  }
}

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: {
    author: string;
    content: string;
    postId?: string;
    parentComment?: string;
    imageUrl?: string;
  }): Promise<CommentDocument> {
    const comment = new this.commentModel({
      ...data,
      author: new Types.ObjectId(data.author),
      parentComment: data.parentComment ? new Types.ObjectId(data.parentComment) : null,
    });
    
    await this.userModel.findByIdAndUpdate(data.author, { $inc: { points: 5 } }).catch(() => {});

    return (await comment.save()).populate('author');
  }

  async getCommentsByPostId(postId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ postId, parentComment: null })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getReplies(parentCommentId: string): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ parentComment: new Types.ObjectId(parentCommentId) })
      .populate('author')
      .sort({ createdAt: 1 })
      .exec();
  }

  async toggleLike(commentId: string, userId: string): Promise<{ likes: number; isLiked: boolean }> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const userObjectId = new Types.ObjectId(userId);
    const index = comment.likes.findIndex((id) => id.equals(userObjectId));

    let isLiked = false;
    let pointsChange = 0;
    
    if (index > -1) {
      comment.likes.splice(index, 1);
      pointsChange = -2;
    } else {
      comment.likes.push(userObjectId);
      isLiked = true;
      pointsChange = 2;
    }

    await comment.save();

    if (comment.author.toString() !== userId) {
       await this.userModel.findByIdAndUpdate(comment.author, { $inc: { points: pointsChange } }).catch(() => {});
    }

    return { likes: comment.likes.length, isLiked };
  }

  async findById(id: string): Promise<CommentDocument | null> {
    return this.commentModel.findById(id).populate('author').exec();
  }

  async editComment(id: string, userId: string, content: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.toString() !== userId) throw new UnauthorizedException('Not the author');
    
    comment.content = content;
    return (await comment.save()).populate('author');
  }

  async deleteComment(id: string, userId: string): Promise<{ success: boolean }> {
    const comment = await this.commentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.toString() !== userId) throw new UnauthorizedException('Not the author');

    // Also delete any replies to this comment
    await this.commentModel.deleteMany({ parentComment: new Types.ObjectId(id) });
    await this.commentModel.findByIdAndDelete(id);
    
    // Deduct points for deletion
    await this.userModel.findByIdAndUpdate(userId, { $inc: { points: -5 } }).catch(() => {});

    return { success: true };
  }
}

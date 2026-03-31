import { Model } from 'mongoose';
import { CommentDocument } from './schemas/comment.schema';
import { UserDocument } from '../user/schemas/user.schema';
export declare class CommentsService {
    private commentModel;
    private userModel;
    constructor(commentModel: Model<CommentDocument>, userModel: Model<UserDocument>);
    create(data: {
        author: string;
        content: string;
        postId?: string;
        parentComment?: string;
        imageUrl?: string;
    }): Promise<CommentDocument>;
    getCommentsByPostId(postId: string): Promise<CommentDocument[]>;
    getReplies(parentCommentId: string): Promise<CommentDocument[]>;
    toggleLike(commentId: string, userId: string): Promise<{
        likes: number;
        isLiked: boolean;
    }>;
    findById(id: string): Promise<CommentDocument | null>;
    editComment(id: string, userId: string, content: string): Promise<CommentDocument>;
    deleteComment(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}

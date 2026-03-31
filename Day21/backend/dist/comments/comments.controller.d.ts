import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getComments(postId: string): Promise<import("./schemas/comment.schema").CommentDocument[]>;
    getReplies(commentId: string): Promise<import("./schemas/comment.schema").CommentDocument[]>;
    createComment(req: any, data: any): Promise<import("./schemas/comment.schema").CommentDocument>;
    replyToComment(req: any, id: string, data: any): Promise<import("./schemas/comment.schema").CommentDocument>;
    likeComment(req: any, id: string): Promise<{
        likes: number;
        isLiked: boolean;
    }>;
    editComment(req: any, id: string, data: {
        content: string;
    }): Promise<import("./schemas/comment.schema").CommentDocument>;
    deleteComment(req: any, id: string): Promise<{
        success: boolean;
    }>;
}

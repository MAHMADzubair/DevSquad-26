import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getComments(postId: string): Promise<any[]>;
    getReplies(commentId: string): Promise<any[]>;
    createComment(req: any, data: any): Promise<any>;
    replyToComment(req: any, id: string, data: any): Promise<any>;
    likeComment(req: any, id: string): Promise<{
        likes: number;
        isLiked: boolean;
    }>;
    editComment(req: any, id: string, data: {
        content: string;
    }): Promise<any>;
    deleteComment(req: any, id: string): Promise<{
        success: boolean;
    }>;
}

export interface Comment {
    id: string;
    author: string;
    text: string;
    timestamp: Date;
}
export declare class CommentsService {
    private comments;
    private commentIdCounter;
    addComment(data: {
        author: string;
        text: string;
    }): Comment;
    getComments(): Comment[];
    deleteComment(id: string): boolean;
    getCommentById(id: string): Comment | undefined;
}

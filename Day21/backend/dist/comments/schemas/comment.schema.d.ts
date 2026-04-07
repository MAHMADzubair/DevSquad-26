import { Document, Types } from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    author: Types.ObjectId;
    content: string;
    postId: string;
    parentComment: Types.ObjectId;
    likes: Types.ObjectId[];
    imageUrl: string;
}
export declare const CommentSchema: any;

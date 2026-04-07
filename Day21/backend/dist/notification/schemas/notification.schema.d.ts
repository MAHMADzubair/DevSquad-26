import { Document, Types } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare enum NotificationType {
    COMMENT = "comment",
    REPLY = "reply",
    LIKE = "like",
    FOLLOW = "follow"
}
export declare class Notification {
    recipient: Types.ObjectId;
    sender: Types.ObjectId;
    type: NotificationType;
    comment: Types.ObjectId;
    read: boolean;
}
export declare const NotificationSchema: any;

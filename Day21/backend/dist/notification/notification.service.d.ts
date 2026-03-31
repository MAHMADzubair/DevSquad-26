import { Model, Types } from 'mongoose';
import { NotificationDocument, NotificationType } from './schemas/notification.schema';
export declare class NotificationService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(data: {
        recipient: string | Types.ObjectId;
        sender: string | Types.ObjectId;
        type: NotificationType;
        commentId?: string | Types.ObjectId;
    }): Promise<NotificationDocument>;
    getNotifications(userId: string): Promise<NotificationDocument[]>;
    markAsRead(notificationId: string): Promise<NotificationDocument>;
}

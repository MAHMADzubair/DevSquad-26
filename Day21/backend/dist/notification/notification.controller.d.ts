import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any): Promise<import("./schemas/notification.schema").NotificationDocument[]>;
    markAsRead(id: string): Promise<import("./schemas/notification.schema").NotificationDocument>;
}

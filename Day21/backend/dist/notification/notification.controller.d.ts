import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any): Promise<any[]>;
    markAsRead(id: string): Promise<any>;
}

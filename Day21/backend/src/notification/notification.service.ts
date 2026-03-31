import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: {
    recipient: string | Types.ObjectId;
    sender: string | Types.ObjectId;
    type: NotificationType;
    commentId?: string | Types.ObjectId;
  }): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      recipient: new Types.ObjectId(data.recipient as any),
      sender: new Types.ObjectId(data.sender as any),
      type: data.type,
      comment: data.commentId ? new Types.ObjectId(data.commentId as any) : null,
    });
    const saved = await notification.save();
    return saved.populate('sender comment') as any;
  }

  async getNotifications(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .populate('sender comment')
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string): Promise<NotificationDocument> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(notificationId, { read: true }, { new: true })
      .exec();
    return updated as any;
  }
}

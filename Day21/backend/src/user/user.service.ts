import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate('followers following').exec();
  }

  async toggleFollow(currentUserId: string, targetUserId: string): Promise<any> {
    const user = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);

    if (!user || !targetUser) {
      throw new NotFoundException('User not found');
    }

    const isFollowing = user.following.some((id) => id.toString() === targetUserId);

    if (isFollowing) {
      user.following = user.following.filter((id) => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
    } else {
      user.following.push(new Types.ObjectId(targetUserId));
      targetUser.followers.push(new Types.ObjectId(currentUserId));
    }

    await user.save();
    await targetUser.save();

    return { following: !isFollowing };
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<UserDocument> {
    const updated = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    return updated as any;
  }
}

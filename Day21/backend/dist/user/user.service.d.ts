import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(userData: Partial<User>): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    toggleFollow(currentUserId: string, targetUserId: string): Promise<any>;
    updateProfile(userId: string, updateData: Partial<User>): Promise<UserDocument>;
}

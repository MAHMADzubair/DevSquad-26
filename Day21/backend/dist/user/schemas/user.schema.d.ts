import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    username: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    points: number;
}
export declare const UserSchema: any;

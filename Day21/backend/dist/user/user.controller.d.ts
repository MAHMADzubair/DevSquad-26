import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<import("./schemas/user.schema").UserDocument | null>;
    getUserProfile(id: string): Promise<import("./schemas/user.schema").UserDocument | null>;
    updateProfile(req: any, updateData: any): Promise<import("./schemas/user.schema").UserDocument>;
    toggleFollow(req: any, id: string): Promise<any>;
}

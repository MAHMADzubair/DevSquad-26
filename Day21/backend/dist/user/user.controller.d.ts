import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<any>;
    getUserProfile(id: string): Promise<any>;
    updateProfile(req: any, updateData: any): Promise<any>;
    toggleFollow(req: any, id: string): Promise<any>;
}

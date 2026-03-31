import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(userData: any): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            email: string;
            profilePicture: string;
        };
        access_token: string;
    }>;
    login(userData: any): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            username: string;
            email: string;
            profilePicture: string;
        };
        access_token: string;
    }>;
}

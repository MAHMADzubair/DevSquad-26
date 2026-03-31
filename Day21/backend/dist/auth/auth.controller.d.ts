import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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

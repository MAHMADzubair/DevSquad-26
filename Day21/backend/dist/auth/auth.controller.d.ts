import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(userData: any): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            profilePicture: any;
        };
        access_token: any;
    }>;
    login(userData: any): Promise<{
        user: {
            id: any;
            username: any;
            email: any;
            profilePicture: any;
        };
        access_token: any;
    }>;
}

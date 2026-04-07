import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
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

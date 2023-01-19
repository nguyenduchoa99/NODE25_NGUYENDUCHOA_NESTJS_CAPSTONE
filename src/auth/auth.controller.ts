import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { RegisterDto, LoginDto } from '../users/dto/index';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @HttpCode(200)
    @Post('login')
    async login(@Body() body: LoginDto): Promise<{ Token: string }> {
        const user = await this.authService.validateUser(body);
        const Token = await this.authService.login(user);
        return { Token };
    };

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<string> {
        return this.authService.register(body)
    }
}

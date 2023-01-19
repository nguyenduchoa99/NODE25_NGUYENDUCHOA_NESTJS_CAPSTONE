import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('Jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
    handleRequest(err, user, info: Error | null) {
        if (err || !user) {
            throw new UnauthorizedException({
                message: 'Không đủ quyền, Token sai',
                error: info instanceof Error ? info.message : info,
            });
        }
        return user;
    }
};
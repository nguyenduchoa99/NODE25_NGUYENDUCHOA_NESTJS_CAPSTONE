import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NguoiDungDto } from 'src/users/dto';

@Injectable()
export class JwtStrategy extends
    PassportStrategy(Strategy, 'Jwt') {
    constructor(private readonly config: ConfigService) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("SECRET_KEY"),
        });
    }
    async validate(payload: NguoiDungDto) {
        return payload
    }
}
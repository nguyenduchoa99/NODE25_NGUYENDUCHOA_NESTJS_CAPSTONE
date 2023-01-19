import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { forwardRef } from '@nestjs/common/utils';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get('SECRET_KEY'),
          signOptions: { expiresIn: '1y' }
        };
      },
      inject: [ConfigService]
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }

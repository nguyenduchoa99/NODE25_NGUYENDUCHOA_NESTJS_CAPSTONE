import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
  controllers: [TheaterController],
  providers: [TheaterService,JwtStrategy]
})
export class TheaterModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [AuthModule],
  controllers: [MovieController],
  providers: [MovieService, JwtStrategy],
  exports: [MovieService]
})
export class MovieModule { }

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TheaterModule } from './theater/theater.module';
import { MovieModule } from './movie/movie.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilrer } from './common/exception/httpException.filter';
import { PrismaClientExceptionFilter } from './common/exception/exception.filer';
import { BookingModule } from './booking/booking.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
    , UsersModule, TheaterModule, MovieModule, AuthModule, BookingModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilrer
    },
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter
    }
  ]
})
export class AppModule { }

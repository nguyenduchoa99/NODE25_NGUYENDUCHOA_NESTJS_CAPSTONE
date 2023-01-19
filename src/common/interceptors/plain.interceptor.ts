import { map, Observable } from 'rxjs';
import { instanceToPlain } from 'class-transformer';
import { NestInterceptor, CallHandler, Injectable, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PlainInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(map((data) => instanceToPlain(data)));
    }
}
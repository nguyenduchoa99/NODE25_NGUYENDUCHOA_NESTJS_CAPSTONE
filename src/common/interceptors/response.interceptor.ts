import { map, Observable } from 'rxjs';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

export interface Response<T> {
    message: string;
    content: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>>{
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => {
                return {
                    message: 'Xử lý thành công',
                    content: data
                }
            }),
        );
    }
};
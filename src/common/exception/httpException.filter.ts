import { Response } from 'express';
import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilrer implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const status = exception.getStatus();

        if (typeof exception.getResponse() === 'string') {
            res.status(status).json({
                statusCode: status,
                message: exception.message,
                error: exception.getResponse()
            });
            return;
        }
        res.status(status).json(exception.getResponse());
    }
};
import { Response } from 'express';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { errorCodes } from '../constants/errorCode.enum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch(PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        switch (exception.code) {
            case errorCodes.overLong: {
                const status = HttpStatus.BAD_REQUEST;
                res.status(status).json({
                    statusCode: status,
                    message: "Thông tin nhập vào vượt quá số ký tự yêu cầu",
                    error: exception.meta ? exception.meta : exception.code
                });
                break;
            }
            case errorCodes.constraint: {
                const status = HttpStatus.CONFLICT;
                res.status(status).json({
                    statusCode: status,
                    message: "Thông tin nhập vào không phù hợp",
                    error: exception.meta ? exception.meta : exception.code
                });
                break;
            }
            case errorCodes.foreign: {
                const status = HttpStatus.BAD_REQUEST;
                res.status(status).json({
                    statusCode: status,
                    message: 'Không tìm thấy khóa ngoại',
                    error: exception.meta ? exception.meta : exception.code
                });
                break;
            }
            case errorCodes.illegal: {
                const status = HttpStatus.NOT_FOUND;
                res.status(status).json({
                    statusCode: status,
                    message: 'Không tìm thấy dữ liệu',
                    error: exception.meta ? exception.meta : exception.code
                });
                break;
            }
            default: {
                const status = HttpStatus.BAD_REQUEST;
                res.status(status).json({
                    statusCode: status,
                    message: `Yêu cầu không thành công, Mã lỗi Prisma: ${exception.code}`,
                    error: exception.meta ? exception.meta : exception.code,
                });
                break;
            }
        }
    }
}
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { Request } from 'express';

export function uploadFile(...mimetypes: string[]) {
    return (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
        if (!mimetypes.some((value) => file.mimetype.includes(value))) {
            cb(
                new UnsupportedMediaTypeException(
                    `Dữ liệu không phù hợp: ${mimetypes.join(',')}`
                ),
                false
            );
            return;
        }
        cb(null, true);
    };
};
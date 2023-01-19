import { ArgumentMetadata, Injectable, BadRequestException, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseFile implements PipeTransform {
    transform(files: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File | Express.Multer.File[] {
        if (files === null || files === undefined) {
            throw new BadRequestException('Xác thực không thành công');
        }
        if (Array.isArray(files) && files.length === 0) {
            throw new BadRequestException('Xác thực không thành công');
        }
        return files
    }
}
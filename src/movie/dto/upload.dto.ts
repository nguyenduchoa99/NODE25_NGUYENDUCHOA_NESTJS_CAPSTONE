import { ApiProperty } from "@nestjs/swagger";

export interface UploadDto {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: string
}

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    movie: {
        type: 'string';
        format: 'binary'
    }
}
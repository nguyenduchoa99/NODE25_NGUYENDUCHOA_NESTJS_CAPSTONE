import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Request } from 'express';
import { NguoiDungDto } from '../users/dto/user.dto';

export interface RequestUser extends Request {
    user: NguoiDungDto;
}

export class PaginationQuery {
    @IsString()
    @ApiPropertyOptional()
    tuKhoa: string = '';

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiPropertyOptional()
    trangBatDau: number = 1;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    @ApiPropertyOptional()
    trangKetThuc: number = 5;
}

export class PaginationMovieQuery {
    @IsString()
    @ApiPropertyOptional()
    ten_phim: string = '';

    @IsInt()
    @Type(() => Number)
    @ApiPropertyOptional()
    trangBatDau: number = 1;

    @IsInt()
    @Type(() => Number)
    @ApiPropertyOptional()
    trangKetThuc: number = 5;

    @IsDateString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    tuNgay: string = '1970-01-01T00:00:01.000Z';

    @IsDateString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    denNgay: string = '2099-01-01T01:00:01.000Z';
}

export class PaginationResDto<T>{
    trangBatDau: number;
    soDieuLieuTrongTrang: number;
    tongTrang: number;
    tongDuLieu: number;
    duLieu: Array<T>;
}

export interface ResSuccess<T> {
    message: string;
    content: T;
}
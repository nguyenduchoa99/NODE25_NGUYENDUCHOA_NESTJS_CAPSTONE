import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsBoolean, IsInt, IsDateString, IsNotEmpty, IsString, IsOptional, Min, Max } from 'class-validator';
import { Opposite } from "src/common/decorators/opposite.decorator";
import { Banner, Phim } from "@prisma/client";

export class MovieEntity implements Phim {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_phim: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ten_phim: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    trailer: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiPropertyOptional()
    hinh_anh: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    mo_ta: string;

    @IsDateString()
    @IsOptional()
    @ApiPropertyOptional()
    ngay_khoi_chieu: string;

    @IsInt()
    @Min(0)
    @Max(10)
    @IsOptional()
    @ApiPropertyOptional()
    danh_gia: number;

    @IsBoolean()
    @IsOptional()
    @ApiPropertyOptional()
    hot: boolean;

    @IsBoolean()
    @ApiProperty({ default: false })
    dang_chieu: boolean;

    @IsBoolean()
    @ApiProperty({ default: true })
    @Opposite(MovieEntity, (s) => s.dang_chieu)
    sap_chieu: boolean;

    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
}

export class BannerEntity implements Banner {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_banner: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_phim: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    hinh_anh: string;

    @Exclude()
    is_deleted: boolean;
}

export class BannerDto extends OmitType(BannerEntity, ['is_deleted']) { }

export class MovieDto extends OmitType(MovieEntity, ['is_deleted']) { }

export class CreateMovieDto extends OmitType(MovieEntity, [
    'is_deleted',
    'ma_phim',
]) { }

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_phim: number;
}
import { ApiProperty, ApiPropertyOptional, OmitType, PickType } from "@nestjs/swagger";
import { CumRap, Ghe, HeThongRap, LichChieu, RapPhim } from '@prisma/client';
import { IsBoolean, IsDateString, IsNotEmpty, IsInt, IsOptional, IsString } from 'class-validator';
import { Exclude } from "class-transformer";
import { MovieDto } from '../../movie/dto/index';


export class HeThongRapEntity implements HeThongRap {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ma_he_thong_rap: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ten_he_thong_rap: string;

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    logo: string;

    @IsOptional()
    @ApiPropertyOptional()
    cumRap?: RapDto[];

    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
}

export class CumRapEntity implements CumRap {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ma_cum_rap: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ten_cum_rap: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    dia_chi: string;

    @IsOptional()
    @ApiPropertyOptional()
    rapPhim?: RapPhimDto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ma_he_thong_rap: string;

    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
}

export class RapPhimEntity implements RapPhim {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_rap: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ten_rap: string;

    @IsOptional()
    @ApiPropertyOptional()
    ghe?: GheDto[];

    @IsOptional()
    @ApiPropertyOptional()
    lichChieu?: LichChieuDto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ma_cum_rap: string;

    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
}

export class RapPhimDto extends OmitType(RapPhimEntity, [
    'is_deleted',
]) { }

export class LichChieuEntity implements LichChieu {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_lich_chieu: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_rap: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_phim: number;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty()
    ngay_gio_chieu: string;

    @IsOptional()
    @ApiPropertyOptional()
    rapPhim?: RapPhimDto;

    @IsOptional()
    @ApiPropertyOptional()
    phim?: MovieDto;

    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
}

export class GheEntity implements Ghe {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_ghe: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ten_ghe: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    loai_ghe: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_rap: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    gia_ghe: number;

    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
}

export class HeThongRapDto extends OmitType(HeThongRapEntity, [
    'is_deleted'
]) { }

export class RapDto extends OmitType(RapPhimEntity, ['is_deleted']) { }

export class LichChieuDto extends OmitType(LichChieuEntity, ['is_deleted']) { }
export class LichCongChieuDto extends PickType(LichChieuEntity, [
    'ma_lich_chieu',
    'ma_rap',
    'ngay_gio_chieu',
]) {
    ten_rap: string;
}
export class TaoLichChieuDto extends OmitType(LichChieuEntity, [
    'ma_lich_chieu',
    'rapPhim',
    'phim',
    'is_deleted',
]) { }

export class GheDto extends OmitType(GheEntity, ['is_deleted']) { }

export class lichChieuCumRapRawDto {
    ma_cum_rap: string;
    ten_cum_rap: string;
    dia_chi: string;
    rapPhim: {
        sort(arg0: (a: any, b: any) => number): unknown;
        ma_rap: number;
        ten_rap: string;
        lichChieu: {
            ma_rap: number;
            ma_lich_chieu: number;
            ma_phim: number;
            ngay_gio_chieu: string;
        }[];
    }[];
}
export class lichChieuCumRapDto {
    ma_cum_rap: string;
    ten_cum_rap: string;
    dia_chi: string;
    lichChieuPhim: {
        ma_lich_chieu: number;
        ma_rap: number;
        ten_rap: string;
        ngay_gio_chieu: string;
    }[];
}
export class lichChieuPhimRawDto {
    ma_he_thong_rap: string;
    ten_he_thong_rap: string;
    logo: string;
    cumRap: Array<lichChieuCumRapRawDto>;
}
export class lichChieuPhimDto {
    ma_he_thong_rap: string;
    ten_he_thong_rap: string;
    logo: string;
    cumRap: Array<lichChieuCumRapDto>;
}

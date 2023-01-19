import { ApiProperty, ApiPropertyOptional, OmitType, PickType } from '@nestjs/swagger';
import { DatVe } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { IsArray, ArrayNotEmpty, IsBoolean, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { NguoiDungDto } from 'src/users/dto';
import { LichChieuDto, GheDto } from 'src/theater/dto';


export class BookingEntity implements DatVe {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    tai_khoan: number;
  
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_lich_chieu: number;
  
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    ma_ghe: number;
  
    @Exclude()
    @IsBoolean()
    is_deleted: boolean;
  
    @IsOptional()
    @ApiPropertyOptional()
    nguoiDung?: NguoiDungDto;
  
    @IsOptional()
    @ApiPropertyOptional()
    lichChieu?: LichChieuDto;
  
    @IsOptional()
    @ApiPropertyOptional()
    ghe?: GheDto;
  }
  
  export class BookingDto extends OmitType(BookingEntity, ['is_deleted']) {}
  export class CreateBookingDto extends PickType(BookingEntity, [
    'tai_khoan',
    'ma_lich_chieu',
    'ma_ghe',
  ]) {}
  
  export class GheCuaNguoiDungDto extends PickType(BookingEntity, [
    'tai_khoan',
    'ma_ghe',
  ]) {}
  export class CreateManyBookingDto extends PickType(BookingEntity, [
    'ma_lich_chieu',
  ]) {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => GheCuaNguoiDungDto)
    @ApiProperty({ type: [GheCuaNguoiDungDto] })
    danhSachVe: GheCuaNguoiDungDto[];
  }
  
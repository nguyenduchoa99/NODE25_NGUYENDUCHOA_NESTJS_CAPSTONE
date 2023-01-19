import { ApiProperty, ApiPropertyOptional, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { NguoiDung } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum LoaiNguoiDung {
    QUANTRI = 'Quan_tri',
    KhachHang = 'KhachHang'
}

@Exclude()
export class NguoiDungEntity implements NguoiDung {
    @IsNumber()
    @ApiProperty()
    @Expose()
    tai_khoan: number;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    mat_khau: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    ho_ten: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    so_dt: string;

    @IsEnum(LoaiNguoiDung)
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    loai_nguoi_dung: string;

    @Exclude()
    is_deleted: boolean;
}

export class LoginDto extends PickType(NguoiDungEntity, [
    'email',
    'mat_khau'
]) { }

export class NguoiDungDto extends OmitType(NguoiDungEntity, [
    'mat_khau',
    'is_deleted'
]) { }

export class RegisterDto extends OmitType(NguoiDungEntity, [
    'tai_khoan',
    'loai_nguoi_dung',
    'is_deleted'
]) { }

export class UpdateDto extends PickType(NguoiDungEntity, [
    'email',
    'mat_khau'
]) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    ho_ten?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    so_dt?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    matKhauMoi?: string;
}

export class CreateNguoiDungDtoQuanTri extends OmitType(NguoiDungEntity, [
    'tai_khoan',
    'is_deleted'
]) { }

export class UpdateNguoiDungDtoQuanTri extends OmitType(NguoiDungEntity, [
    'tai_khoan',
    'is_deleted'
]) { }

export class UpdateQuanTriDto extends PartialType(
    UpdateNguoiDungDtoQuanTri,
) {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    @Expose()
    tai_khoan: number;
}
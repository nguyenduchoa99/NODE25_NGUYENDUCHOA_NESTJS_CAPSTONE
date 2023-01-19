import { Controller, Body, Get, Post, Put, Query, DefaultValuePipe, UseGuards, NotFoundException, Delete, Req, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { ApiBearerAuth, ApiTags, ApiQuery } from "@nestjs/swagger";
import { PaginationQuery, PaginationResDto, RequestUser } from '../dto/index';
import { CreateNguoiDungDtoQuanTri, LoaiNguoiDung, NguoiDungDto, UpdateDto, UpdateQuanTriDto } from '../users/dto/index';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';


@ApiTags("QuanLyNguoiDung")
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) { }

    // Lấy danh sách loại người dùng
    @Roles(LoaiNguoiDung.QUANTRI)
    @Get('layDanhSachLoaiNguoiDung')
    getUserRoles(): Promise<LoaiNguoiDung[]> {
        return this.userService.getUserRoles();
    }

    // Lấy danh sách người dùng
    @Roles(LoaiNguoiDung.QUANTRI)
    @Get('layDanhSachNguoiDung')
    async getUserList(): Promise<NguoiDungDto[]> {
        return await this.userService.getUserList();
    }

    // Tìm kiếm người dùng theo tên
    @Roles(LoaiNguoiDung.QUANTRI)
    @ApiQuery({ name: 'tên', required: false })
    @Get('timKiemNguoiDung')
    async getUserByName(@Query('tên', new DefaultValuePipe('')) tuKhoa: string): Promise<NguoiDungDto[]> {
        return await this.userService.getUserByName(tuKhoa);
    }


    //Tìm kiếm người dùng theo tên và phân trang
    @Roles(LoaiNguoiDung.QUANTRI)
    @Get('timKiemNguoiDungPhanTrang')
    async getUserByNamePagination(@Query() { tuKhoa, trangBatDau, trangKetThuc }: PaginationQuery): Promise<PaginationResDto<NguoiDungDto>> {
        return this.userService.getUserByNamePagination(tuKhoa, trangBatDau, trangKetThuc)
    }

    // Lấy thông tin người dùng bằng tài khoản
    @Roles(LoaiNguoiDung.QUANTRI)
    @Get('layThongTinTaiKhoan')
    @ApiQuery({ name: 'tai_khoan', required: false })
    async getUserInfo(@Query('tai_khoan') tai_khoan: number): Promise<NguoiDungDto> {
        const user = await this.userService.getUserInfo(tai_khoan);
        if (user) {
            return user
        }
        else {
            throw new NotFoundException('Người dùng không tồn tại')
        }
    }

    // Thêm người dùng
    @Roles(LoaiNguoiDung.QUANTRI)
    @Post('themNguoiDung')
    async addUser(@Body() data: CreateNguoiDungDtoQuanTri) {
        return await this.authService.register(data);
    }

    // Cập nhật thông tin người dùng QUẢN TRỊ
    @Roles(LoaiNguoiDung.QUANTRI)
    @Put('capNhatThongTinAdmin')
    async updateUserByAdmin(@Body() body: UpdateQuanTriDto): Promise<NguoiDungDto> {
        return await this.userService.updateUserByAmin(body)
    }
    
    // Cập nhật thông tin người dùng
    @Put('capNhatThongTinNguoiDung')
    async updateUser(@Req() req: RequestUser, @Body() body: UpdateDto): Promise<NguoiDungDto> {
        const { tai_khoan, email } = req.user;
        if (email !== body.email) {
            throw new ConflictException('Email không trùng khớp');
        }
        await this.authService.validateUser({ email, mat_khau: body.mat_khau });
        return await this.userService.updateUser(body, tai_khoan);
    }
    
    // Xóa người dùng
    @Roles(LoaiNguoiDung.QUANTRI)
    @Delete('xoaNguoiDung')
    @ApiQuery({ name: 'tai_khoan', required: false })
    async deleteUser(@Query('tai_khoan') tai_khoan: number): Promise<string> {
        return await this.userService.deleteUser(tai_khoan)
    }
}

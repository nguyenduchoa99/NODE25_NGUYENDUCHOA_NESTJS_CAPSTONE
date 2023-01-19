import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NguoiDung, PrismaClient } from '@prisma/client';
import { NguoiDungDto, RegisterDto, LoaiNguoiDung, UpdateQuanTriDto, UpdateDto } from './dto';
import { nguoiDungSelect } from 'prisma/prismaSelect';
import * as bcrypt from 'bcrypt';
import { PaginationResDto } from '../dto/index';
import { PagiRes } from '../common/models/response';

@Injectable()
export class UsersService {
    constructor(
        private readonly config: ConfigService
    ) { }
    private prisma: PrismaClient = new PrismaClient();


    // Lấy thông tin người dùng bằng email
    async getUserByEmail(email: string): Promise<NguoiDung> {
        const user = await this.prisma.nguoiDung.findFirst({
            where: { email, is_deleted: false },
        });
        if (!user) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Email không tồn tại',
                error: { email }
            })
        }
        return user;
    }

    // Tạo người dùng mới
    async createUser(data: RegisterDto) {
        const newUser = await this.prisma.nguoiDung.create({ data: data });
        return newUser;
    }


    //Lấy danh sách loại người dùng
    async getUserRoles() {
        return await Object.values(LoaiNguoiDung);
    }


    // Lấy danh sách người dùng
    async getUserList(): Promise<NguoiDungDto[]> {
        return await this.prisma.nguoiDung.findMany({
            where: { is_deleted: false },
            select: nguoiDungSelect
        });
    }


    // Tìm kiếm danh sách người dùng bằng Tên
    async getUserByName(tuKhoa: string): Promise<NguoiDungDto[]> {
        return await this.prisma.nguoiDung.findMany({
            where: { ho_ten: { contains: `${tuKhoa}%` }, is_deleted: false },
            select: nguoiDungSelect
        });
    }

    // Tìm kiếm danh sách người dùng bằng Tên và phân trang
    async getUserByNamePagination(tuKhoa: string, trangBatDau: number, trangKetThuc: number): Promise<PaginationResDto<NguoiDungDto>> {
        const [userList, tongDuLieu] = await Promise.all([
            this.prisma.nguoiDung.findMany({
                where: { ho_ten: { contains: `${tuKhoa}%` }, is_deleted: false },
                skip: (trangBatDau - 1) * trangKetThuc,
                take: trangKetThuc,
                select: nguoiDungSelect
            }),
            this.prisma.nguoiDung.count({
                where: { ho_ten: { contains: `${tuKhoa}%` }, is_deleted: false },
            }),
        ]);
        return new PagiRes<NguoiDungDto>({
            trangBatDau,
            trangKetThuc,
            tongDuLieu,
            duLieu: userList,
        }).res();
    }

    // Lấy thông tin người dùng bằng tài khoản
    async getUserInfo(tai_khoan: number): Promise<NguoiDungDto | null> {
        return await this.prisma.nguoiDung.findFirst({
            where: { tai_khoan, is_deleted: false },
            select: nguoiDungSelect
        })
    }

    // Cập nhật thông tin người dùng bởi quản trị
    async updateUserByAmin(data: UpdateQuanTriDto): Promise<NguoiDungDto> {
        data.mat_khau = bcrypt.hashSync(
            data.mat_khau,
            Number(this.config.get('BCRYPT_SALT'))
        );
        const updateUser = await this.prisma.nguoiDung.update({
            where: { tai_khoan: data.tai_khoan },
            data: data,
        });
        delete updateUser.mat_khau,
            delete updateUser.is_deleted;
        return updateUser
    }
    // Cập nhật thông tin người dùng
    async updateUser(data: UpdateDto, tai_khoan: number): Promise<NguoiDungDto> {
        const { matKhauMoi, ...userInfo } = data;
        if (matKhauMoi) {
            userInfo.mat_khau = bcrypt.hashSync(matKhauMoi, Number(this.config.get('BCRYPT_SALT')));
        }
        const updateUser = await this.prisma.nguoiDung.update({
            where: { tai_khoan },
            data: userInfo
        });
        delete updateUser.mat_khau;
        delete updateUser.is_deleted;
        return updateUser;
    }

    // Xóa người dùng
    async deleteUser(tai_khoan:number){
        await this.prisma.nguoiDung.delete({where:{tai_khoan}});
        return 'Xóa tài khoản thành công'
    }
}


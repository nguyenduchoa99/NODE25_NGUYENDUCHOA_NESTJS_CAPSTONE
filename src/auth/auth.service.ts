import { Injectable, HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { CreateNguoiDungDtoQuanTri, LoginDto, NguoiDungDto, RegisterDto } from '../users/dto/index';

import { errorCodes } from '../common/constants/errorCode.enum';

import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) { }
    private prisma: PrismaClient = new PrismaClient();

    // Validation
    async validateUser({ email, mat_khau }: LoginDto): Promise<NguoiDungDto> {
        const user = await this.userService.getUserByEmail(email);
        const checkMatKhau = bcrypt.compareSync(mat_khau, user.mat_khau);
        if (checkMatKhau) {
            const { mat_khau: matKhau, is_deleted, ...result } = user;
            return result;
        }
        else {
            throw new UnauthorizedException('Mật khẩu không đúng')
        }
    }

    //Login 
    async login(user: NguoiDungDto): Promise<string> {
        return this.jwtService.sign(user);
    }

    //Register
    async register(data: RegisterDto | CreateNguoiDungDtoQuanTri): Promise<string> {
        try {
            const mat_khau_hash = bcrypt.hashSync(data.mat_khau, Number(this.configService.get('BCRYPT_SALT')));
            await this.userService.createUser({ ...data, mat_khau: mat_khau_hash });
            return 'Tạo người dùng thành công'
        }
        catch (error) {
            if (
                error instanceof PrismaClientKnownRequestError && error.code === errorCodes.constraint
            ) {
                throw new ConflictException({
                    statusCode: HttpStatus.CONFLICT,
                    message: 'Email đã tồn tại',
                    error: error.meta ? error.meta : data
                });
            }
            else {
                throw error
            };
        }
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { bannerSelect, phimSelect } from '../../prisma/prismaSelect';
import { PrismaClient } from '@prisma/client';
import { BannerDto, CreateMovieDto, MovieDto, UpdateMovieDto } from './dto/index';
import { PaginationMovieQuery, PaginationResDto } from '../dto/index';
import { PagiRes } from '../common/models/response';
import { getUrl } from '../utils/untils';

@Injectable()
export class MovieService {
    constructor(
        private config: ConfigService
    ) { }
    private prisma: PrismaClient = new PrismaClient();

    // Lấy danh sách banner
    async getBanner(): Promise<BannerDto[]> {
        return await this.prisma.banner.findMany({
            where: {
                is_deleted: false
            },
            select: bannerSelect
        });
    };

    // Lấy thông tin phim
    async getInfoMoive(ma_phim: number): Promise<MovieDto> {
        const infoMovie = await this.prisma.phim.findFirst({
            where: { ma_phim, is_deleted: false },
            select: phimSelect
        });
        if (!infoMovie) {
            throw new NotFoundException('Mã phim không tồn tại');
        }
        else {
            return infoMovie
        }
    }

    // Lấy danh sách phim theo tên
    async getMovieByName(ten_phim: string): Promise<MovieDto[]> {
        return await this.prisma.phim.findMany({
            where: { ten_phim: { contains: ten_phim }, is_deleted: false },
            select: phimSelect
        });
    }

    // Lấy danh sách phim theo tên, phân trang và số lượng phim
    async getMoivePagination(query: PaginationMovieQuery): Promise<PaginationResDto<MovieDto>> {
        const { ten_phim, trangBatDau, trangKetThuc, tuNgay, denNgay } = query;

        const [movieList, tongDuLieu] = await Promise.all([
            this.prisma.phim.findMany({
                skip: (trangBatDau - 1) * trangKetThuc,
                take: trangKetThuc,
                where: {
                    ten_phim: { contains: ten_phim },
                    ngay_khoi_chieu: { gte: tuNgay, lte: denNgay },
                    is_deleted: false
                },
                select: phimSelect
            }),
            this.prisma.phim.count({
                where: {
                    ten_phim: { contains: ten_phim },
                    ngay_khoi_chieu: { gte: tuNgay, lte: denNgay },
                    is_deleted: false,
                }
            })
        ]);
        return new PagiRes<MovieDto>({
            trangBatDau,
            trangKetThuc,
            tongDuLieu,
            duLieu: movieList,
        }).res();
    }

    // Thêm phim mới
    async createMove(movie: CreateMovieDto): Promise<MovieDto> {
        return await this.prisma.phim.create({ data: movie, select: phimSelect });
    }

    // Upload hình ảnh phim
    async uploadImg(req: Request, ma_phim: number, filename: string) {
        const data = getUrl(
            req,
            this.config.get('URL_MOVIE'),
            filename
        );
        await this.prisma.phim.update({
            where: { ma_phim },
            data: { hinh_anh: data }
        });
        return { data };
    }

    // Cập nhật phim
    async updateMoive(data: UpdateMovieDto): Promise<MovieDto> {
        return await this.prisma.phim.update({
            where: { ma_phim: data.ma_phim },
            data,
            select: phimSelect
        });
    }

    // Xóa phim
    async deleteMovie(ma_phim: number): Promise<MovieDto> {
        return await this.prisma.phim.delete({
            where: { ma_phim },
            select: phimSelect
        })
    }


}

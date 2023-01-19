import { Controller, Req, Put, DefaultValuePipe, ParseFilePipe, PayloadTooLargeException, ParseIntPipe, Body, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags, ApiQuery } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { PaginationMovieQuery, PaginationResDto } from '../dto/index';
import { BannerDto, CreateMovieDto, MovieDto, UpdateMovieDto, FileUploadDto } from './dto/index';
import { LoaiNguoiDung } from '../users/dto/index';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { diskStorage } from 'multer';

import { MovieService } from './movie.service';
import { Delete, Get, Post } from '@nestjs/common/decorators';
import { uploadFile } from '../common/exception/upload.filter';


@ApiTags('QuanLyPhim')
@Controller('movie')
export class MovieController {
    constructor(
        private readonly movieService: MovieService,
        private readonly config: ConfigService
    ) { }

    // Lấy danh sách banner
    @Get('layDanhSachBanner')
    async getBanner(): Promise<BannerDto[]> {
        return await this.movieService.getBanner();
    }

    // Lấy thông tin phim
    @Get('layThongTinPhim/:ma_phim')
    async getInfoMovie(@Param('ma_phim') ma_phim: number): Promise<MovieDto> {
        return await this.movieService.getInfoMoive(ma_phim)
    }

    //Lấy danh sách phim theo tên
    @Get('layDanhSachPhimTheoTen')
    @ApiQuery({ name: 'ten_phim', required: false })
    async getMoiveByName(@Query('ten_phim', new DefaultValuePipe('')) ten_phim: string): Promise<MovieDto[]> {
        return await this.movieService.getMovieByName(ten_phim)
    }

    // Lấy danh sách phim theo phân trang
    @Get('layDanhSachPhimPhanTrang')
    async getMoviePagination(@Query() data: PaginationMovieQuery): Promise<PaginationResDto<MovieDto>> {
        return await this.movieService.getMoivePagination(data)
    }

    // Thêm phim
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(LoaiNguoiDung.QUANTRI)
    @Post('themPhim')
    async createMovie(@Body() body: CreateMovieDto): Promise<MovieDto> {
        return await this.movieService.createMove(body)
    }

    // Upload hình ảnh phim
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(LoaiNguoiDung.QUANTRI)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'IMG',
        type: FileUploadDto
    })
    @Post('upload/:ma_phim')
    @UseInterceptors(
        FileInterceptor('movie', {
            fileFilter: uploadFile('jpg', 'jpeg', 'png'),
            storage: diskStorage({
                destination: process.env.MOVIE_URL,
                filename(req, file, callback) {
                    callback(null, Date.now() + '_' + file.originalname);
                },
            }),
        }),
    )
    uploadImage(
        @Param('ma_phim', ParseIntPipe) ma_phim: number,
        @Req() req: Request,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
    ) {
        const fileLimit = Number(this.config.get('MOVIE_FILE_LIMIT'));
        if (file.size > fileLimit * 1024 * 1024) {
            fs.unlinkSync(
                process.cwd() +
                '/' +
                this.config.get('URL_MOVIE') +
                '/' +
                file.filename,
            );
            throw new PayloadTooLargeException(
                `Dữ liệu không được lớn hơn ${fileLimit} MB(s)`,
            );
        }
        return this.movieService.uploadImg(req, ma_phim, file.filename);
    }

    // Cập nhật phim
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(LoaiNguoiDung.QUANTRI)
    @Put('capNhatPhim')
    async updateMovie(@Body() body: UpdateMovieDto): Promise<MovieDto> {
        return await this.movieService.updateMoive(body)
    }

    // Xóa phim
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(LoaiNguoiDung.QUANTRI)
    @Delete('xoaPhim/:ma_phim')
    async deleteMovie(@Param('ma_phim', ParseIntPipe) ma_phim: number): Promise<MovieDto> {
        return await this.movieService.deleteMovie(ma_phim)
    }
}

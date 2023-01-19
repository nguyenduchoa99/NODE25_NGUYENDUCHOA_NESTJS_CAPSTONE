import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { TheaterService } from './theater.service';
import { HeThongRapDto } from './dto/index'
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';


@ApiTags('QuanLyRap')
@Controller('theater')
export class TheaterController {
    constructor(
        private readonly theaterService: TheaterService
    ) { }

    // Lấy thông tin hệ thống rạp
    @Get('layThongTinHeThongRap')
    @ApiQuery({ name: 'ma_he_thong_rap', required: false })
    async getThongTinHeThongRap(@Query('ma_he_thong_rap') ma_he_thong_rap: string): Promise<HeThongRapDto[]> {
        return await this.theaterService.getHeThongRap(ma_he_thong_rap)
    }

    // Lấy thông tin cum rạp
    @Get('layDanhSachCumRap')
    @ApiQuery({ name: 'ma_he_thong_rap', required: false })
    async getDanhSachCumRap(@Query('ma_he_thong_rap') ma_he_thong_rap: string) {
        return await this.theaterService.getDanhSachCumRap(ma_he_thong_rap)
    }

    // Lấy thông tin lịch chiếu phim
    @Get('layThongTinLichChieuPhim/:ma_phim')
    async getThongTinLichChieuPhim(@Param('ma_phim') ma_phim: number) {
        let checkMaPhim = await this.theaterService.getLayThongTinLichChieuPhim(ma_phim)
        if (checkMaPhim.check) {
            return checkMaPhim.data
        }
        else {
            throw new HttpException(checkMaPhim.data, HttpStatus.NOT_FOUND)
        }
    }

    // Lấy thông tin lịch chiếu của hệ thống rạp
    @Get('layThongTinLichChieuCuaHeThongRap/:ma_he_thong_rap')
    async getThongTinLichChieuCuaHeThongRap(@Param('ma_he_thong_rap') ma_he_thong_rap: string) {
        let checkMaHeThongRap = await this.theaterService.getThongTinLichChieuHeThongRap(ma_he_thong_rap);
        if (checkMaHeThongRap.check) {
            return checkMaHeThongRap.data;
        }
        else {
            throw new HttpException(checkMaHeThongRap.data, HttpStatus.NOT_FOUND)
        }
    }
}

import { Controller, Body, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateManyBookingDto } from './dto/booking.dto';
import { TaoLichChieuDto } from 'src/theater/dto';
import { LoaiNguoiDung } from 'src/users/dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('QuanLyDatVE')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) { }

    // Đặt vé xem phm
    @Post('datVe')
    async bookTicket(@Body() body: CreateManyBookingDto): Promise<string> {
        return await this.bookingService.bookTicket(body)
    }

    // Tạo lịch chiếu
    @Roles(LoaiNguoiDung.QUANTRI)
    @Post('taoLichChieu')
    async createLichChieu(@Body() body: TaoLichChieuDto) {
        return await this.bookingService.createLichChieu(body)
    }

    // Lấy danh sách ghế theo lịch chiếu
    @Get('layGheTheoLichChieu/:ma_lich_chieu')
    async getGheTheoLichChieu(@Param('ma_lich_chieu', ParseIntPipe) ma_lich_chieu: number) {
        return await this.bookingService.getGheTheoLichChieu(ma_lich_chieu)
    }

}

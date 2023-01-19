import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { lichChieuSelect, seatSelect } from 'prisma/prismaSelect';
import { errorCodes } from 'src/common/constants/errorCode.enum';
import { CreateManyBookingDto } from './dto/booking.dto';
import { TaoLichChieuDto } from 'src/theater/dto';
@Injectable()
export class BookingService {
    private prisma: PrismaClient = new PrismaClient();

    // Đặt vé xem phim
    async bookTicket(data: CreateManyBookingDto): Promise<string> {
        try {
            const { ma_lich_chieu, danhSachVe } = data;
            const danhSachGhe = await this.prisma.ghe.findMany({
                where: {
                    RapPhim: {
                        LichChieu: {
                            some: {
                                ma_lich_chieu
                            }
                        }
                    },
                    is_deleted: false
                },
                select: { ma_ghe: true }
            });
            danhSachVe.forEach((ve) => {
                const values = danhSachGhe.find((ghe) => ghe.ma_ghe === ve.ma_ghe);
                if (!values) {
                    throw new BadRequestException(`Mã ghế ${ve.ma_ghe} không có trong lịch chiếu ${ma_lich_chieu}`)
                }
            });
            const datVe = danhSachVe.map((ve) => ({
                ...ve,
                ma_lich_chieu
            }));
            await this.prisma.datVe.createMany({ data: datVe })
            return 'Đặt vé thành công'
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === errorCodes.constraint) {
                throw new ConflictException('Ghế đã được đặt trước hoặc bị trùng lặp')
            }
            throw error
        }
    }


    // Tạo lịch chiếu
    async createLichChieu(data: TaoLichChieuDto) {
        return await this.prisma.lichChieu.create({
            data,
            select: lichChieuSelect
        })
    }

    // Lấy danh sách ghế theo lịch chiếu
    async getGheTheoLichChieu(ma_lich_chieu: number) {
        const [seatListRaw, bookedList, scheduleInfo] = await Promise.all([
            this.prisma.ghe.findMany({
                where: { RapPhim: { LichChieu: { some: { ma_lich_chieu } } } },
                select: { ...seatSelect },
                orderBy: { ten_ghe: 'asc' },
            }),
            this.prisma.datVe.findMany({
                where: { ma_lich_chieu },
                select: { ma_ghe: true, tai_khoan: true },
                orderBy: { Ghe: { ten_ghe: 'asc' } },
            }),
            this.prisma.lichChieu.findFirst({
                where: { ma_lich_chieu },
                select: {
                    ngay_gio_chieu: true,
                    Phim: true,
                    RapPhim: { select: { ten_rap: true, CumRap: true } },
                },
            }),
        ]);

        if (!scheduleInfo) {
            throw new NotFoundException('SLịch chiếu không tồn tại');
        }
        let i: number = 0;
        const seatList = seatListRaw.map((seat) => {
            let taiKhoan: number | null = null;
            if (i < bookedList.length && bookedList[i].ma_ghe === seat.ma_ghe) {
                taiKhoan = bookedList[i].tai_khoan;
                i++;
            }

            return {
                ...seat,
                daDat: taiKhoan ? true : false,
                taiKhoan,
            };
        });

        const { ten_cum_rap, dia_chi } = scheduleInfo.RapPhim.CumRap;
        const { ten_phim, hinh_anh } = scheduleInfo.Phim;
        const scheduleFullInfo = {
            ma_lich_chieu,
            ten_cum_rap,
            dia_chi,
            ten_rap: scheduleInfo.RapPhim.ten_rap,
            ten_phim,
            hinh_anh,
            ngay_gio_chieu: scheduleInfo.ngay_gio_chieu,
            danhSachGhe: seatList,
        };

        return scheduleFullInfo;
    }
}

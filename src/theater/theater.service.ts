import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { heThonRapSelect } from '../../prisma/prismaSelect';
import { HeThongRapDto } from './dto/index';
@Injectable()
export class TheaterService {
    private prisma: PrismaClient = new PrismaClient();

    // Lấy thông tin hệ thống rạp
    async getHeThongRap(ma_he_thong_rap: string): Promise<HeThongRapDto[]> {
        return await this.prisma.heThongRap.findMany({
            where: { ma_he_thong_rap, is_deleted: false },
            select: heThonRapSelect
        });
    }

    // Lấy thông tin cụm rạp có trong hệ thông rạp
    async getDanhSachCumRap(ma_he_thong_rap: string) {
        const rapPhimList = await this.prisma.cumRap.findMany({
            where: { ma_he_thong_rap, is_deleted: false },
            select: {
                ma_cum_rap: true,
                ten_cum_rap: true,
                dia_chi: true,
                RapPhim: { select: { ma_rap: true, ten_rap: true } }
            }
        });
        if (rapPhimList.length === 0) {
            throw new NotFoundException('Mã hệ thống rạp không tồn tại');
        }
        return rapPhimList;
    }

    // Lấy thông tin lịch chiếu theo hệ thông rạp  
    async getThongTinLichChieuHeThongRap(ma_he_thong_rap: string) {
        let checkMaHeThongRap = await this.prisma.heThongRap.findFirst({
            where: {
                ma_he_thong_rap
            }
        })
        if (checkMaHeThongRap) {
            let data = await this.prisma.heThongRap.findMany({
                where: {
                    ma_he_thong_rap
                },
                include: {
                    CumRap: {
                        include: {
                            RapPhim: {
                                include: {
                                    LichChieu: {
                                        include: {
                                            Phim: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            })
            return {
                check: true,
                data
            }
        }
        else {
            return {
                check: false,
                data: 'Mã hệ thống rạp không tồn tại'
            }
        }
    }

    // Lấy thông tin lịch chiếu phim
    async getLayThongTinLichChieuPhim(ma_phim: number) {
        let checkMaPhim = await this.prisma.phim.findFirst({
            where: { ma_phim }
        })
        if (checkMaPhim) {
            let data = await this.prisma.phim.findMany({
                where: {
                    ma_phim
                },
                include: {
                    LichChieu: {
                        include: {
                            RapPhim: {
                                include: {
                                    CumRap: {
                                        include: {
                                            HeThongRap: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            return {
                check: true,
                data
            }
        }
        else {
            return {
                check: false,
                data: 'Mã phim không tồn tại'
            }
        }

    }
}
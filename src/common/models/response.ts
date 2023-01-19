export class PagiRes<T> {
    trangBatDau: number;
    trangKetThuc: number;
    tongDuLieu: number;
    duLieu: Array<T>;

    constructor(resItems: Partial<PagiRes<T>>) {
        Object.assign(this, resItems);
    }
    res() {
        return {
            trangBatDau: this.trangBatDau,
            soDieuLieuTrongTrang: this.duLieu.length, tongTrang: Math.ceil(this.tongDuLieu / this.trangKetThuc),
            tongDuLieu: this.tongDuLieu,
            duLieu: this.duLieu,
        };
    }
}
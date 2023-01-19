import { SetMetadata } from '@nestjs/common';
import { LoaiNguoiDung } from '../../users/dto';

export const ROLESKEY = 'roles';
export const Roles = (...roles: LoaiNguoiDung[]) => SetMetadata(ROLESKEY, roles);
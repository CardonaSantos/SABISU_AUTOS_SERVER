import { Rol } from 'prisma/generated/pos';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id?: number;

  @IsString()
  nombre: string;

  @IsEmail()
  @IsString()
  correo: string;

  @IsEnum(Rol)
  rol: Rol;

  @Min(8)
  @IsString()
  contrasena: string;

  @Min(8)
  @IsString()
  contrasenaConfirm?: string;

  @IsInt()
  sucursalId: number;

  @IsBoolean()
  activo: boolean;
}

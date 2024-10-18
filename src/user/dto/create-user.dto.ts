import { Rol } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
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

  @IsInt()
  sucursalId: number;

  @IsBoolean()
  activo: boolean;
}

import { Rol } from 'prisma/generated/pos';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Min,
} from 'class-validator';

export class CreateAuthDto {
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
}

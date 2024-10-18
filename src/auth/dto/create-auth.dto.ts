import { Rol } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsString, Min } from 'class-validator';

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
}

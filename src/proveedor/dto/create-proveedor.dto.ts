import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsString()
  telefono: string;

  @IsBoolean()
  activo: boolean;

  @IsString()
  direccion: string;

  @IsString()
  razonSocial: string;

  @IsString()
  rfc: string;

  @IsString()
  nombreContacto: string;

  @IsString()
  telefonoContacto: string;

  @IsEmail()
  emailContacto: string;

  @IsString()
  pais: string;

  @IsString()
  ciudad: string;

  @IsString()
  codigoPostal: string;

  @IsOptional()
  @IsString()
  latitud?: string;

  @IsOptional()
  @IsString()
  longitud?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}

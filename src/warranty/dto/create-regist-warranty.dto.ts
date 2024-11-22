import { EstadoGarantia } from '@prisma/client';
import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class RegistroGarantiaDto {
  @IsInt()
  @IsPositive()
  garantiaId: number;

  @IsInt()
  @IsOptional()
  usuarioId?: number;

  @IsInt()
  @IsPositive()
  productoId: number;

  @IsEnum(EstadoGarantia)
  estado: EstadoGarantia;

  @IsString()
  @IsOptional()
  conclusion?: string;

  @IsString()
  @IsOptional()
  accionesRealizadas?: string;

  @IsDate()
  @IsOptional()
  fechaRegistro?: Date;

  @IsOptional()
  @IsNumber()
  proveedorId?;
}

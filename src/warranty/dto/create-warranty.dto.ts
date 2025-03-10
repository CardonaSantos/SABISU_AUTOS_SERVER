import { EstadoGarantia } from '@prisma/client';
import {
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateWarrantyDto {
  @IsInt()
  clienteId: number;

  @IsInt()
  productoId: number;

  @IsInt()
  usuarioIdRecibe: number;

  @IsOptional()
  @IsString()
  comentario?: string; // Comentario sobre el fallo

  @IsNotEmpty()
  @IsString()
  descripcionProblema: string; // Descripción detallada del problema

  @IsEnum(EstadoGarantia)
  estado: EstadoGarantia;

  @IsOptional()
  @IsNumber()
  proveedorId?;
}

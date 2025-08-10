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
  ventaProductoID?: number;

  @IsInt()
  sucursalId: number;

  @IsInt()
  clienteId: number;
  @IsInt()
  ventaId: number;

  @IsInt()
  productoId: number;

  @IsInt()
  cantidadDevuelta: number;

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

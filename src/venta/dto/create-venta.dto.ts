import { MetodoPago } from '@prisma/client';
import {
  IsDate,
  IsArray,
  IsEnum,
  IsNumber,
  IsInt,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateVentaDto {
  @IsNumber()
  clienteId?: number;

  @IsArray()
  productos: Array<{
    productoId: number;
    cantidad: number;
    precioProductoId: number; // Agregar el ID del precio del producto
    selectedPriceId: number;
  }>;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsInt()
  sucursalId: number;

  @IsString()
  @IsOptional()
  nombreClienteFinal: string;

  @IsString()
  @IsOptional()
  telefonoClienteFinal: string;

  @IsString()
  @IsOptional()
  direccionClienteFinal: string;
}

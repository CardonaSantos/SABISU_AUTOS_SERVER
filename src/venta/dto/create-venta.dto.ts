import { MetodoPago } from '@prisma/client';
import { IsDate, IsArray, IsEnum, IsNumber, IsInt } from 'class-validator';

export class CreateVentaDto {
  @IsNumber()
  clienteId?: number;

  @IsArray()
  productos: Array<{ productoId: number; cantidad: number }>;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsInt()
  sucursalId: number;
}

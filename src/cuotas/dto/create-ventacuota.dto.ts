// create-venta-cuota.dto.ts
import {
  IsInt,
  IsDateString,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCuota } from 'prisma/generated/pos';

export class CreateVentaCuotaDto {
  @IsInt()
  clienteId: number;

  @IsOptional()
  @IsNumber()
  diasEntrePagos: number;

  @IsOptional()
  @IsNumber()
  interes: number;

  @IsInt()
  usuarioId: number;

  @IsInt()
  sucursalId: number;

  @IsNumber()
  totalVenta: number;

  @IsNumber()
  cuotaInicial: number;

  @IsNumber()
  montoTotalConInteres: number;

  @IsInt()
  cuotasTotales: number;

  @IsDateString()
  fechaInicio: string;

  @IsEnum(EstadoCuota)
  estado: EstadoCuota;

  @IsArray()
  @IsOptional()
  //   productos?: any[]; // Aquí puedes definir un tipo más específico si lo deseas
  productos?: { productoId: number; cantidad: number; precioVenta: number }[]; // Productos vendidos

  @IsString()
  dpi: string;

  @IsOptional()
  testigos?: any; // Puedes definir la estructura de testigos si es necesario

  @IsDateString()
  @IsOptional()
  fechaContrato?: string;

  @IsNumber()
  @IsOptional()
  montoVenta?: number;

  @IsInt()
  @IsOptional()
  garantiaMeses?: number;

  @IsOptional()
  comentario?: string;
}

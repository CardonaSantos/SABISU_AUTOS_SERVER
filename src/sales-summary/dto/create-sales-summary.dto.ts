import { ResumenPeriodo } from '@prisma/client';
import { IsEnum, IsInt, IsString } from 'class-validator';

export class CreateSalesSummaryDto {
  @IsInt()
  sucursalId?: number; // si quieres por sucursal
  @IsInt()
  usuarioId?: number; // si quieres por usuario

  @IsEnum(ResumenPeriodo)
  periodo: ResumenPeriodo;
  @IsString()
  fechaInicio: string;
  @IsString()
  fechaFin: string;
  @IsInt()
  totalVentas: number; // suma de montos
  @IsInt()
  totalTransacciones: number; // número de tickets/facturas
  @IsInt()
  unidadesVendidas: number; // suma de unidades vendidas
  @IsInt()
  ticketPromedio?: number; // totalVentas / totalTransacciones
  @IsInt()
  productoTopId?: number; // producto con más ventas en el período
  @IsString()
  observaciones?: string; // opcional, para notas adicionales
  @IsString()
  titulo?: string;
}

export class DetalleResumenVenta {
  resumenVentaId: number; // referencia al resumen de ventas
  productoId: number; // referencia al producto
  cantidadVendida: number; // unidades vendidas de este producto
  montoVenta: number; // total facturado de este producto
}

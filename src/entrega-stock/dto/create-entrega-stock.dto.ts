import { IsInt, IsNumber, IsDate, IsArray } from 'class-validator';

export class CreateEntregaStockDto {
  @IsInt()
  proveedorId: number;

  @IsNumber()
  montoTotal: number;

  @IsDate()
  fechaEntrega: Date;

  @IsArray()
  stockEntregado: Array<{
    productoId: number;
    cantidad: number;
    precioCosto: number;
    fechaVencimiento?: Date;
  }>;

  @IsInt()
  recibidoPorId: number;

  @IsInt()
  sucursalId: number;
}

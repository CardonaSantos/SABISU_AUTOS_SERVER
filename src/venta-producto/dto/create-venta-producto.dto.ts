import { IsInt, IsPositive, IsDate } from 'class-validator';

export class CreateVentaProductoDto {
  @IsInt()
  ventaId: number;

  @IsInt()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsDate()
  creadoEn: Date;

  @IsInt()
  selectedPrice?: number;
}

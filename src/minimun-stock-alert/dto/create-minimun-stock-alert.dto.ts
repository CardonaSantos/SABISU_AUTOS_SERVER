import { IsInt, Min } from 'class-validator';

export class CreateMinimunStockAlertDto {
  @IsInt()
  @Min(1)
  productoId: number;

  @IsInt()
  @Min(1)
  sucursalId: number;

  @IsInt()
  @Min(0)
  stockMinimo: number;
}

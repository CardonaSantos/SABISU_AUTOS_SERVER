// src/pedidos/dto/get-pedidos-query.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProductosToPedidosQuery {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  sucursalId?: number;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  codigoProducto?: string;

  @IsOptional()
  @IsString()
  codigoProveedor?: string;

  pageSize: number;
  page: number;
  search: string;
}

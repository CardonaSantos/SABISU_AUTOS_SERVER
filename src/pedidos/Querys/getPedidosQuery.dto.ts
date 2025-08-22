// src/pedidos/dto/get-pedidos.query.dto.ts
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PedidoEstado } from '@prisma/client'; // o tu enum espejo

export class GetPedidosQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  // búsqueda global (folio, observaciones, cliente/sucursal/usuario nombre)
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  search?: string;

  @IsOptional()
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sucursalId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  clienteId?: number;

  // rango de fechas (sobre Pedido.fecha)
  @IsOptional()
  @IsDateString()
  fechaFrom?: string; // ISO

  @IsOptional()
  @IsDateString()
  fechaTo?: string; // ISO

  // ordenamiento seguro
  @IsOptional()
  @IsString()
  sortBy?:
    | 'fecha'
    | 'folio'
    | 'estado'
    | 'totalPedido'
    | 'totalLineas'
    | 'creadoEn'
    | 'actualizadoEn'
    | 'clienteNombre'
    | 'sucursalNombre';

  @IsOptional()
  @IsString()
  sortDir?: 'asc' | 'desc';

  @IsInt()
  productoId: number;
}

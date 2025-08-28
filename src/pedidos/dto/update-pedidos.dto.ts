// /src/pedidos/dto/update-pedido.dto.ts
import {
  IsInt,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PedidoPrioridad {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA',
}

export enum TipoPedido {
  INTERNO = 'INTERNO',
  CLIENTE = 'CLIENTE',
}

class UpdatePedidoLineaDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsOptional()
  precioCostoActual?: number;

  notas: string;
}

export class UpdatePedidoDto {
  @IsInt()
  sucursalId: number;

  @IsOptional()
  @IsInt()
  clienteId: number | null;

  @IsEnum(PedidoPrioridad)
  prioridad: PedidoPrioridad;

  @IsEnum(TipoPedido)
  tipo: TipoPedido;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePedidoLineaDto)
  lineas: UpdatePedidoLineaDto[];
}

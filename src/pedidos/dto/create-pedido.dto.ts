import {
  IsArray,
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PedidoEstado } from '@prisma/client';
import { CreatePedidoLineaDto } from './create-pedido-linea';

/**
 * DTO para crear el pedido con sus líneas
 * - `folio` es opcional por si lo autogeneras en backend.
 * - `fecha` opcional; si no se manda, Prisma usa `now()`.
 * - `estado` opcional; por defecto `PENDIENTE`.
 * - `totalLineas` y `totalPedido` no se reciben; los calculas en el servicio.
 */
export class CreatePedidoDto {
  @IsOptional()
  @IsDateString({}, { message: 'fecha debe ser ISO 8601' })
  fecha?: string;

  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'sucursalId inválido' })
  sucursalId!: number;

  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'clienteId inválido' })
  clienteId!: number;

  @IsInt()
  @Type(() => Number)
  @Min(1, { message: 'usuarioId inválido' })
  usuarioId!: number;

  @IsOptional()
  @IsEnum(PedidoEstado, { message: 'estado inválido' })
  estado?: PedidoEstado; // default PENDIENTE en Prisma

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  observaciones?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos una línea' })
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoLineaDto)
  lineas!: CreatePedidoLineaDto[];

  // Si en algún caso enlazas un pedido a una compra al momento de crear:
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  compraId?: number;
}

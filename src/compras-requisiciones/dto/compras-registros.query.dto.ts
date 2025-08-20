// dto/compras-registros.query.dto.ts
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ComprasRegistrosQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sucursalId?: number;

  @IsOptional()
  @IsString()
  estado?: 'RECIBIDO' | 'CANCELADO' | 'RECIBIDO_PARCIAL' | 'ESPERANDO_ENTREGA';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  proveedorId?: number;

  @IsOptional()
  @IsBoolean()
  conFactura?: boolean;

  // Filtro por fecha del documento compra (cabecera)
  @IsOptional()
  @IsString()
  fechaInicio?: string; // ISO or YYYY-MM-DD

  @IsOptional()
  @IsString()
  fechaFin?: string; // ISO or YYYY-MM-DD

  // Filtro por creadoEn (creación en DB)
  @IsOptional()
  @IsString()
  creadoInicio?: string;

  @IsOptional()
  @IsString()
  creadoFin?: string;

  // Rangos por total
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minTotal?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxTotal?: number;

  // Búsqueda libre (proveedor, folio requisición, factura, usuario, producto)
  @IsOptional()
  @IsString()
  search?: string;

  // Orden
  @IsOptional()
  @IsString()
  @IsIn(['fecha', 'creadoEn', 'total'])
  orderBy?: 'fecha' | 'creadoEn' | 'total';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  // Opcional: agrupar por proveedor (similar a groupBySucursal)
  @IsOptional()
  @IsBoolean()
  groupByProveedor?: boolean;

  // Performance: incluir o no detalles (si vas a dibujar listado compacto)
  @IsOptional()
  @IsBoolean()
  withDetalles?: boolean;
}

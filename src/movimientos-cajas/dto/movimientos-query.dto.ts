// src/movimientos-cajas/dto/movimientos-query.dto.ts
import {
  IsOptional,
  IsInt,
  IsString,
  IsISO8601,
  IsBooleanString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const toStringArray = (v: unknown) =>
  v === undefined || v === null
    ? undefined
    : Array.isArray(v)
      ? v.map(String).filter(Boolean)
      : String(v)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

export class MovimientosQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sucursalId?: number;

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  tipo?: string[]; // ["INGRESO","EGRESO","DEPOSITO_BANCO","TRANSFERENCIA","VENTA","DEVOLUCION","RETIRO"]

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  categoria?: string[]; // ["DEPOSITO_CIERRE","DEPOSITO_PROVEEDOR","GASTO_OPERATIVO","COSTO_VENTA"]

  @IsOptional()
  @IsISO8601()
  fechaInicio?: string;

  @IsOptional()
  @IsISO8601()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  search?: string;

  // Compatibilidad con FE anterior
  @IsOptional()
  @IsBooleanString()
  usadoParaCierre?: string; // 'true' | 'false'

  // (futuro) groupBySucursal
  @IsOptional()
  @IsBooleanString()
  groupBySucursal?: string;
}

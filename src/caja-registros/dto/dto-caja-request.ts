// src/caja-registros/dto/caja-registros-query.dto.ts
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsISO8601,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum EstadoCaja {
  ABIERTO = 'ABIERTO',
  CERRADO = 'CERRADO',
  ARQUEO = 'ARQUEO',
}

const toStringArray = (v: unknown) => {
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return String(v)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const toBool = (v: unknown) => {
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  return ['true', '1', 'yes', 'y', 'on'].includes(s);
};

export class CajaRegistrosQueryDto {
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
  @IsEnum(EstadoCaja)
  estado?: EstadoCaja;

  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  depositado?: boolean;

  // Rango de CAJA
  @IsOptional() @IsISO8601() fechaAperturaInicio?: string;
  @IsOptional() @IsISO8601() fechaAperturaFin?: string;
  @IsOptional() @IsISO8601() fechaCierreInicio?: string;
  @IsOptional() @IsISO8601() fechaCierreFin?: string;

  // Filtros de MOVIMIENTOS
  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  tipo?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  categoria?: string[];

  @IsOptional() @IsISO8601() fechaMovInicio?: string;
  @IsOptional() @IsISO8601() fechaMovFin?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  groupBySucursal?: boolean;
}

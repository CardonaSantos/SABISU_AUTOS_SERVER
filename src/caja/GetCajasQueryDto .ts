// src/caja-registros/dto/caja-registros.dto.ts
import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

const toArray = (v: unknown) => (Array.isArray(v) ? v : v != null ? [v] : []);

export class GetCajasQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  sucursalId?: number;

  @IsOptional()
  @IsIn(['ABIERTO', 'CERRADO', 'ARQUEO'])
  estado?: 'ABIERTO' | 'CERRADO' | 'ARQUEO';

  @IsOptional()
  @IsBooleanString()
  depositado?: string; // 'true' | 'false'

  @IsOptional() @IsString() fechaAperturaInicio?: string;
  @IsOptional() @IsString() fechaAperturaFin?: string;
  @IsOptional() @IsString() fechaCierreInicio?: string;
  @IsOptional() @IsString() fechaCierreFin?: string;

  // arrays ?tipo=A&tipo=B
  @IsOptional()
  @Transform(({ value }) => toArray(value).map(String))
  tipo?: string[];

  @IsOptional()
  @Transform(({ value }) => toArray(value).map(String))
  categoria?: string[];

  @IsOptional() @IsString() fechaMovInicio?: string;
  @IsOptional() @IsString() fechaMovFin?: string;
  @IsOptional() @IsString() search?: string;

  @IsOptional()
  @IsBooleanString()
  groupBySucursal?: string; // (no-op en esta versión)
}

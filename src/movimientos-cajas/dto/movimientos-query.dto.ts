import { IsOptional, IsInt, IsString, IsISO8601 } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const toStringArray = (v: unknown) => {
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return String(v)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

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
  tipo?: string[];

  @IsOptional()
  @Transform(({ value }) => toStringArray(value))
  categoria?: string[];

  @IsOptional()
  @IsISO8601()
  fechaInicio?: string;

  @IsOptional()
  @IsISO8601()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) =>
    ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase()),
  )
  groupBySucursal?: boolean;
}

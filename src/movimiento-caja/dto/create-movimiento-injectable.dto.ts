import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovimientoInjectableDto {
  @IsOptional()
  @IsInt()
  registroCajaId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  // @IsEnum(TipoMovimientoCaja)
  // tipo?: TipoMovimientoCaja;

  // @IsEnum(CategoriaMovimiento)
  // categoria?: CategoriaMovimiento;

  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  banco?: string;

  @IsOptional()
  @IsString()
  numeroBoleta?: string;

  @IsOptional()
  @IsBoolean()
  usadoParaCierre?: boolean;

  @IsOptional()
  @IsInt()
  proveedorId?: number;

  @IsInt()
  usuarioId: number;
}

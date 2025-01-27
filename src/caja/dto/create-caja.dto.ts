import {
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  IsString,
} from 'class-validator';

export class CreateCajaDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt()
  sucursalId: number;

  @IsOptional()
  @IsInt()
  usuarioId: number;

  @IsNumber()
  saldoInicial: number;

  // @IsOptional()
  // @IsNumber()
  // totalVentas?: number;

  // @IsOptional()
  // @IsNumber()
  // totalEgresos?: number;

  @IsOptional()
  @IsNumber()
  saldoFinal?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaCierre?: string;

  @IsOptional()
  @IsEnum(['ABIERTO', 'CERRADO'])
  estado?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  depositosIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  egresosIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ventasIds?: number[];

  @IsString()
  comentario?: string;
}

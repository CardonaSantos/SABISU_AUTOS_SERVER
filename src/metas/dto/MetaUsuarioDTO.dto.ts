import { EstadoMetaTienda } from '@prisma/client';
import {
  IsInt,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateMetaUsuarioDto {
  @IsInt()
  usuarioId: number; // Relación con el usuario

  @IsInt()
  sucursalId: number; // Relación con la sucursal

  @IsDateString()
  fechaInicio: string; // Fecha de inicio de la meta

  @IsDateString()
  fechaFin: string; // Fecha de fin de la meta

  @IsPositive()
  montoMeta: number; // Monto objetivo de ventas

  // @IsOptional()
  // @IsPositive()
  // montoActual?: number; // (Opcional) Ventas acumuladas por el usuario

  @IsOptional()
  @IsBoolean()
  cumplida?: boolean; // Indica si la meta fue cumplida

  @IsOptional()
  @IsDateString()
  fechaCumplida?: string; // (Opcional) Fecha en que se cumplió la meta

  // @IsOptional()
  // @IsPositive()
  // numeroVentas?: number; // Número de ventas acumuladas (Opcional)

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tituloMeta?: string; // (Opcional) Título descriptivo de la meta

  @IsOptional()
  @IsEnum(EstadoMetaTienda)
  EstadoMetaTienda: EstadoMetaTienda;

  @IsNumber()
  @IsOptional()
  montoActual: number;
}

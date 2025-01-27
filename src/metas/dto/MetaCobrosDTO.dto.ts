import {
  IsInt,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateMetaCobrosDto {
  @IsInt()
  usuarioId: number; // Relación con el usuario

  @IsInt()
  sucursalId: number; // Relación con la sucursal

  @IsDateString()
  fechaInicio: string; // Fecha de inicio de la meta

  @IsDateString()
  fechaFin: string; // Fecha de fin de la meta

  @IsPositive()
  montoMeta: number; // Monto objetivo de cobros

  @IsOptional()
  @IsPositive()
  montoActual?: number; // (Opcional) Cobros acumulados hasta ahora

  @IsOptional()
  @IsBoolean()
  cumplida?: boolean; // Indica si la meta fue cumplida

  @IsOptional()
  @IsDateString()
  fechaCumplida?: string; // (Opcional) Fecha en que se cumplió la meta

  @IsOptional()
  @IsInt()
  numeroDepositos?: number; // Número de depósitos realizados hasta el momento

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tituloMeta?: string; // (Opcional) Título descriptivo de la meta
}

import {
  IsInt,
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';

export class EgresoDto {
  @IsInt()
  id: number; // ID del egreso

  @IsNumber()
  @IsOptional()
  usuarioId?: number;

  @IsOptional()
  @IsInt()
  registroCajaId?: number; // Relación con el registro de caja

  @IsString()
  descripcion: string; // Descripción del egreso

  @IsNumber()
  monto: number; // Monto del egreso

  @IsDateString()
  fechaEgreso: string; // Fecha del egreso

  @IsNumber()
  sucursalId;
}

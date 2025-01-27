import {
  IsInt,
  IsPositive,
  IsOptional,
  IsDateString,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateDepositoCobroDto {
  @IsInt()
  usuarioId: number; // Relación con el usuario que realizó el depósito

  @IsInt()
  sucursalId: number; // Relación con la sucursal

  @IsString()
  @MaxLength(90)
  numeroBoleta: string; // Número de boleta del depósito

  @IsPositive()
  montoDepositado: number; // Monto del depósito realizado
  @IsPositive()
  @IsInt()
  metaCobroId;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string; // (Opcional) Descripción adicional
}

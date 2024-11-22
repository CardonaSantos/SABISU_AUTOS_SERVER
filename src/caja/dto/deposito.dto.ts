import {
  IsInt,
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class DepositoDto {
  @IsInt()
  id: number; // ID del depósito

  @IsOptional()
  @IsInt()
  registroCajaId?: number; // Relación con el registro de caja

  @IsNumber()
  monto: number; // Monto del depósito

  @IsNumber()
  @IsOptional()
  usuarioId?: number;

  @IsString()
  numeroBoleta: string; // Número de boleta

  @IsString()
  banco: string; // Banco donde se realizó el depósito

  @IsDateString()
  fechaDeposito: string; // Fecha del depósito

  @IsOptional()
  @IsBoolean()
  usadoParaCierre?: boolean; // Indica si el depósito se usó para el cierre de caja

  @IsNumber()
  sucursalId: number;

  @IsString()
  descripcion: string;
}

// dto/crear-movimiento.dto.ts
import {
  IsInt,
  Min,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { MetodoPago, MotivoMovimiento } from '@prisma/client';

export class CrearMovimientoDto {
  @IsInt()
  @Min(1)
  sucursalId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  registroCajaId?: number; // requerido si efectivo

  @IsNumber()
  @Min(0.01)
  monto!: number;

  @IsEnum(MotivoMovimiento)
  motivo!: MotivoMovimiento;

  // el servicio infiere clasificacion según motivo
  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago; // p.ej. EFECTIVO, TRANSFERENCIA, DEPOSITO

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsBoolean()
  esDepositoCierre?: boolean;

  @IsOptional()
  @IsBoolean()
  esDepositoProveedor?: boolean;

  // relaciones opcionales
  @IsOptional()
  @IsInt()
  proveedorId?: number;

  @IsOptional()
  @IsInt()
  cuentaBancariaId?: number;

  // subtipos
  @IsOptional()
  @IsString()
  gastoOperativoTipo?: string;

  @IsOptional()
  @IsString()
  costoVentaTipo?: string;

  // quien registra
  @IsInt()
  @Min(1)
  usuarioId!: number;
}

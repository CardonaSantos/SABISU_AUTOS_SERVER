import { EstadoVencimiento } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVencimientoDto {
  @IsString()
  fechaVencimiento: string;
  @IsEnum(EstadoVencimiento)
  estado: EstadoVencimiento;
  @IsString()
  @IsOptional()
  descripcion?: string;
  @IsNumber()
  @IsOptional()
  stockId?: number;
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateRequisicionRecepcionLineaDto {
  @IsInt()
  requisicionLineaId: number; // referencia a la línea original (para trazabilidad)
  @IsInt()
  cantidadSolicitada: number; // cantidad que se solicitó (puede ser útil para validación)
  @IsInt()
  cantidadRecibida: number; // cantidad que realmente se recibió
  @IsBoolean()
  ingresadaAStock?: boolean; // si ya se ingresó al stock (por defecto true)
  @IsInt()
  productoId: number;

  @IsString()
  @IsOptional()
  fechaIngreso?: string;

  @IsString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsNumber()
  precioUnitario: number;

  @IsOptional()
  @Type(() => Date) // <— añade esto
  @IsDate()
  fechaExpiracion?: Date | null;
}

export class CreateRequisicionRecepcionDto {
  @IsInt()
  compraId: number; // id de la requisición que se está recibiendo

  @IsInt()
  requisicionId: number; // id de la requisición que se está recibiendo
  @IsInt()
  usuarioId: number; // id del usuario que hace la recepción
  @IsString()
  observaciones?: string; // notas opcionales
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequisicionRecepcionLineaDto)
  lineas: CreateRequisicionRecepcionLineaDto[];

  //otros datos para trackear
  @IsInt()
  sucursalId: number;
  //campos para generar la entrega stock
  @IsInt()
  proveedorId: number;
}

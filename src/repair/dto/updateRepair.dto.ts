import { EstadoReparacion } from 'prisma/generated/pos';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';

export class updateRepair {
  //
  @IsEnum(EstadoReparacion)
  estado: EstadoReparacion;

  @IsString({
    message: 'La descripción de los problemas debe ser una cadena de texto.',
  })
  @MaxLength(500, {
    message:
      'La descripción de los problemas no puede exceder los 500 caracteres.',
  })
  problemas: string; // Descripción de los problemas reportados

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser una cadena de texto.' })
  @MaxLength(500, {
    message: 'Las observaciones no pueden exceder los 500 caracteres.',
  })
  observaciones?: string; // Observaciones adicionales (accesorios entregados, etc.)
}

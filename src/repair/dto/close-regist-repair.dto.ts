import { EstadoReparacion } from '@prisma/client';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  IsEnum,
} from 'class-validator';

export class closeRepairRegist {
  @IsInt({ message: 'El ID del cliente debe ser un número entero.' })
  sucursalId: number;

  @IsInt({ message: 'El ID del cliente debe ser un número entero.' })
  montoPagado: number;

  @IsInt({ message: 'El ID del cliente debe ser un número entero.' })
  reparacionId: number;

  @IsInt({ message: 'El ID del cliente debe ser un número entero.' })
  usuarioId: number; // ID del cliente asociado a la reparación

  @IsEnum(EstadoReparacion)
  estado: EstadoReparacion; // ID del producto del sistema (opcional)

  @IsOptional()
  @IsString({
    message:
      'La descripción del producto externo debe ser una cadena de texto.',
  })
  accionesRealizadas?: string; // Nombre o descripción del producto externo

  @IsString({
    message: 'La descripción de los problemas debe ser una cadena de texto.',
  })
  comentarioFinal: string; // Descripción de los problemas reportados
}

import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreateRepairDto {
  @IsInt({ message: 'El ID del cliente debe ser un número entero.' })
  clienteId: number; // ID del cliente asociado a la reparación

  @IsOptional()
  @IsInt({ message: 'El ID del producto debe ser un número entero.' })
  productoId?: number; // ID del producto del sistema (opcional)

  @IsOptional()
  @IsString({
    message:
      'La descripción del producto externo debe ser una cadena de texto.',
  })
  @MaxLength(255, {
    message: 'La descripción del producto no puede exceder los 255 caracteres.',
  })
  productoExterno?: string; // Nombre o descripción del producto externo

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

  @IsInt({ message: 'El ID de la sucursal debe ser un número entero.' })
  sucursalId: number; // ID de la sucursal donde se realiza la reparación

  @IsInt({ message: 'El ID del usuario debe ser un número entero.' })
  usuarioId: number; // ID del usuario que realiza el registro
}

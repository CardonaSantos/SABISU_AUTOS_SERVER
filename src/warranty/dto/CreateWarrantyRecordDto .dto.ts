import { EstadoGarantia } from 'prisma/generated/pos';
import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateWarrantyRecordDto {
  @IsInt()
  garantiaId: number;

  @IsInt()
  usuarioId: number;

  @IsOptional()
  @IsInt()
  proveedorId?: number; // Opcional en caso de envío a un proveedor

  @IsNotEmpty()
  estado: EstadoGarantia; // Estado en este punto del registro

  @IsOptional()
  @IsString()
  comentario?: string; // Comentario opcional sobre el estado o proceso
}

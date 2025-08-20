// dto/compra-recepcion-auto.dto.ts
import { IsInt, IsOptional, IsString } from 'class-validator';

export class RecepcionarCompraAutoDto {
  @IsInt()
  compraId!: number;

  @IsInt()
  usuarioId!: number;

  @IsInt()
  proveedorId: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

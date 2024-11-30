// create-plantilla-comprobante.dto.ts
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreatePlantillaComprobanteDto {
  @IsString()
  nombre: string;

  @IsString()
  texto: string;

  @IsInt()
  @IsOptional()
  sucursalId?: number; // La sucursal es opcional
}

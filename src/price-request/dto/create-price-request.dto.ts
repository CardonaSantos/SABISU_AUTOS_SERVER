import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreatePriceRequestDto {
  @IsInt()
  productoId: number;

  @IsNumber()
  precioSolicitado: number;

  @IsInt()
  solicitadoPorId: number;

  @IsOptional()
  @IsInt()
  aprobadoPorId?: number;

  @IsOptional()
  @IsInt()
  fechaRespuesta?: Date;
}

// dto/cerrar-caja.dto.ts
import { IsInt, Min, IsOptional, IsString } from 'class-validator';
export class CerrarCajaDto {
  @IsInt()
  @Min(1)
  registroCajaId!: number;

  @IsOptional()
  @IsString()
  comentarioFinal?: string;
}

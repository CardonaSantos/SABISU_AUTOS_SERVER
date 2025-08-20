// dto/iniciar-caja.dto.ts
import { IsInt, Min, IsOptional, IsNumber, IsString } from 'class-validator';

export class IniciarCajaDto {
  @IsInt()
  @Min(1)
  sucursalId!: number;

  @IsInt()
  @Min(1)
  usuarioInicioId!: number;

  @IsOptional()
  @IsNumber()
  saldoInicial?: number; // si no viene, calculamos

  @IsOptional()
  @IsNumber()
  fondoFijo?: number; // opcional: para sugerir depósito de cierre

  @IsOptional()
  @IsString()
  comentario?: string;
}

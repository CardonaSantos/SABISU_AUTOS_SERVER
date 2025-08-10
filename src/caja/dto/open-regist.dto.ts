import { IsInt, IsOptional, IsString } from 'class-validator';

export class IniciarCaja {
  @IsInt()
  sucursalId: number;
  @IsInt()
  usuarioInicioId: number;

  @IsInt()
  saldoInicial: number;
  @IsOptional()
  @IsString()
  comentario?: string;
}

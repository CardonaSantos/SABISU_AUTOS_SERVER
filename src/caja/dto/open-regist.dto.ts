import {
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsString,
} from 'class-validator';

export class OpenRegistDTO {
  @IsInt()
  sucursalId: number;

  @IsString()
  @IsOptional()
  comentario?: string;

  @IsOptional()
  @IsInt()
  usuarioId?: number;

  @IsNumber()
  saldoInicial: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsEnum(['ABIERTO', 'CERRADO'])
  estado?: string;
}

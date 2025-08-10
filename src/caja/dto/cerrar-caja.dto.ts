import {
  IsInt,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsString,
  IsArray,
} from 'class-validator';
import { IniciarCaja } from './open-regist.dto';

export class CerrarCaja extends IniciarCaja {
  @IsInt()
  usuarioCierra: number;
  @IsInt()
  saldoFinal: number;
  @IsArray()
  movimientosIDS: number[];
  @IsArray()
  ventasIDS: number[];

  @IsInt()
  cajaID: number;
  @IsString()
  comentarioFinal?: string;
}

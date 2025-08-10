import { EstadoGarantia } from '@prisma/client';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class createNewTimeLimeDTO {
  @IsNumber()
  userID: number;
  @IsNumber()
  garantiaID: number;
  @IsEnum(EstadoGarantia)
  estado: EstadoGarantia;
  @IsString()
  conclusion: string;

  @IsString()
  accionesRealizadas: string;
}

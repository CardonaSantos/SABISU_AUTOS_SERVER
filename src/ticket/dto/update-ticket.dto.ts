import { EstadoTicket } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto {
  @IsString()
  @IsOptional()
  descripcionSorteo?: string; // Descripción del sorteo, opcional

  @IsDateString()
  @IsOptional()
  fechaInicio?: Date; // Fecha y hora de inicio del sorteo, opcional

  @IsDateString()
  @IsOptional()
  fechaFinal?: Date; // Fecha y hora de finalización del sorteo, opcional

  @IsEnum(EstadoTicket)
  estado: EstadoTicket;
}

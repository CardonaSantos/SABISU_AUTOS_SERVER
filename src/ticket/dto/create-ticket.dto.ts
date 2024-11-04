import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsOptional()
  descripcionSorteo?: string; // Descripción del sorteo, opcional

  @IsDateString()
  @IsOptional()
  fechaInicio?: Date; // Fecha y hora de inicio del sorteo, opcional

  @IsDateString()
  @IsOptional()
  fechaFinal?: Date; // Fecha y hora de finalización del sorteo, opcional
}

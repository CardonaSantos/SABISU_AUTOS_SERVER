import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaDto } from './create-meta.dto';
import { CreateMetaUsuarioDto } from './MetaUsuarioDTO.dto';
import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { EstadoMetaCobro } from '@prisma/client';

export class UpdateMetaCobroDto {
  //   @IsDateString()
  //   fechaInicio: string; // Fecha de inicio de la meta

  //   @IsDateString()
  //   fechaFin: string; // Fecha de fin de la meta
  @IsPositive()
  montoMeta: number; // Monto objetivo de cobros

  @IsOptional()
  @IsString()
  tituloMeta?: string; // (Opcional) Título descriptivo de la meta

  @IsEnum(EstadoMetaCobro)
  EstadoMetaTienda: EstadoMetaCobro;
}

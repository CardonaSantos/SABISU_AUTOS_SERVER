// update-requisition.dto.ts
import {
  IsNumber,
  IsArray,
  ValidateNested,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRequisitionLineDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  cantidadSugerida: number;

  @IsOptional()
  @Type(() => Date) // <— añade esto
  @IsDate()
  fechaExpiracion?: Date | null;
}

export class UpdateRequisitionDto {
  @IsNumber()
  requisicionId: number;

  @IsNumber()
  sucursalId: number;

  @IsNumber()
  usuarioId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequisitionLineDto)
  lineas: UpdateRequisitionLineDto[];
}

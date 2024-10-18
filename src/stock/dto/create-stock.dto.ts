import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsDate,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';

// Este es el objeto, que esperamos que cada objeto dentro de un array que enviaremos, tenga el formato
export class CreateStockDto {
  @IsInt()
  productoId: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  costoTotal: number;

  @IsDate()
  fechaIngreso: Date;

  @IsOptional()
  @IsDate()
  fechaVencimiento?: Date;

  @IsNumber()
  @IsPositive()
  precioCosto: number;

  @IsOptional()
  @IsInt()
  proveedorId: number;
}

export class StockEntryDTO {
  @IsInt()
  proveedorId: number;

  @IsInt()
  @IsOptional()
  recibidoPorId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockDto)
  stockEntries: CreateStockDto[];
}

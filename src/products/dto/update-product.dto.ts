import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

class PriceDto {
  @IsInt()
  id: number;

  @IsNumber()
  precio: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  nombre: string; // Nombre del producto

  @IsNumber()
  precioCostoActual: number;

  @IsString()
  @IsOptional()
  codigoProducto: string; // Código único del producto

  @IsString()
  @IsOptional()
  descripcion: string; // Código único del producto

  @IsNumber()
  @IsOptional()
  precioVenta: number; // Precio de venta del producto

  @IsArray()
  @IsOptional()
  categorias?: number[]; // IDs de categorías asociadas (opcional)

  @IsArray()
  @IsOptional()
  precios: PriceDto[]; // Arreglo de objetos precio

  @IsInt()
  usuarioId: number;
}

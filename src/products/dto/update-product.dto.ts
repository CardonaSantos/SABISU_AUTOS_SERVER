import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  nombre: string; // Nombre del producto

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
}

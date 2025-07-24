import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolPrecio } from '@prisma/client';

class PriceDto {
  @IsInt()
  id: number;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsInt()
  orden?: number;

  @IsOptional()
  rol?: RolPrecio;
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

  @IsInt()
  @IsOptional()
  stockMinimo: number;

  @IsString()
  @IsOptional()
  descripcion: string; // Código único del producto

  @IsNumber()
  @IsOptional()
  precioVenta: number[]; // Precio de venta del producto

  @IsArray()
  @IsOptional()
  categorias?: number[]; // IDs de categorías asociadas (opcional)

  @IsArray()
  @IsOptional()
  precios: PriceDto[]; // Arreglo de objetos precio

  @IsInt()
  usuarioId: number;

  @IsOptional()
  codigoProveedor: string; // Código del proveedor del producto

  @IsArray()
  imagenes: string[];

  //nuevos
  @IsInt()
  sucursalId?: number;

  @IsString()
  motivoCambio: string;

  @IsInt()
  modificadoPorId?: number;
}

class precioProducto {
  rol: RolPrecio;
  orden: number;
  precio: number;
}

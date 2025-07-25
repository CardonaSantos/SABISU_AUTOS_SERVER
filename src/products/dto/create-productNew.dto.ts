import { RolPrecio, TipoPrecio } from '@prisma/client';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
//NUEVO FORMATO PARA CREAR PRODUCTO => AHORA EL PRECIO ES UN OBJ CON PRECIO, ORDEN, ROL
export class CreateNewProductDto {
  @IsString()
  nombre: string; // Nombre del producto

  @IsString()
  codigoProducto: string; // Código único del producto

  @IsString()
  codigoProveedor?: string;

  @IsString()
  descripcion: string; // Código único del producto

  @IsNumber()
  precioVenta: precioProducto[]; // Precio de venta del producto
  @IsNumber()
  creadoPorId: number;
  @IsArray()
  @IsOptional()
  categorias?: number[]; // IDs de categorías asociadas (opcional)

  @IsNumber()
  precioCostoActual: number;

  @IsInt()
  stockMinimo: number;

  @IsArray()
  imagenes: string[];
}

class precioProducto {
  rol: RolPrecio;
  orden: number;
  precio: number;
}

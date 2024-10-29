import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNewProductDto {
  @IsString()
  nombre: string; // Nombre del producto

  @IsString()
  codigoProducto: string; // Código único del producto

  @IsString()
  descripcion: string; // Código único del producto

  @IsNumber()
  precioVenta: number[]; // Precio de venta del producto
  @IsNumber()
  creadoPorId: number;

  @IsArray()
  @IsOptional()
  categorias?: number[]; // IDs de categorías asociadas (opcional)
}

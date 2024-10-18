import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  nombre: string; // Nombre del producto

  @IsString()
  codigoProducto: string; // Código único del producto

  @IsString()
  descripcion: string; // Código único del producto

  @IsNumber()
  precioVenta: number; // Precio de venta del producto

  @IsArray()
  @IsOptional()
  categorias?: number[]; // IDs de categorías asociadas (opcional)

  @IsArray()
  @IsOptional()
  stock?: CreateStockDto[]; // Opcionalmente, definir lotes de stock al crear el producto
}

// DTO para el Stock relacionado
export class CreateStockDto {
  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsString()
  fechaVencimiento?: string; // Fecha de vencimiento en formato ISO string (opcional)

  @IsNumber()
  precioCosto: number; // Precio de compra del lote
}

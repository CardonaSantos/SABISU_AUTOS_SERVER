// import { MetodoPago } from '@prisma/client';
// import {
//   IsDate,
//   IsArray,
//   IsEnum,
//   IsNumber,
//   IsInt,
//   IsString,
//   IsOptional,
// } from 'class-validator';

// export class CreateVentaDto {
//   @IsNumber()
//   clienteId?: number;

//   @IsArray()
//   productos: Array<{
//     productoId: number;
//     cantidad: number;
//     precioProductoId: number; // Agregar el ID del precio del producto
//     selectedPriceId: number;
//   }>;

//   @IsEnum(MetodoPago)
//   metodoPago: MetodoPago;

//   @IsNumber()
//   monto: number;

//   @IsInt()
//   sucursalId: number;

//   @IsString()
//   @IsOptional()
//   nombreClienteFinal: string;

//   @IsString()
//   @IsOptional()
//   telefonoClienteFinal: string;

//   @IsString()
//   @IsOptional()
//   direccionClienteFinal: string;
// }

import { MetodoPago } from '@prisma/client';
import {
  IsDate,
  IsArray,
  IsEnum,
  IsNumber,
  IsInt,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateVentaDto {
  @IsNumber()
  @IsOptional()
  clienteId?: number; // Si es un cliente existente

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  dpi?: string;

  @IsString()
  @IsOptional()
  iPInternet?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsArray()
  productos: Array<{
    productoId: number;
    cantidad: number;
    selectedPriceId: number;
  }>;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsNumber()
  monto: number;

  @IsInt()
  sucursalId: number;

  @IsString()
  @IsOptional()
  imei?: string; // Campo opcional para IMEI
}

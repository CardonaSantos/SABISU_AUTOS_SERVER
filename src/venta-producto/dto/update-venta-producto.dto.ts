import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaProductoDto } from './create-venta-producto.dto';

export class UpdateVentaProductoDto extends PartialType(CreateVentaProductoDto) {}

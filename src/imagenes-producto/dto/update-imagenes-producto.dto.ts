import { PartialType } from '@nestjs/mapped-types';
import { CreateImagenesProductoDto } from './create-imagenes-producto.dto';

export class UpdateImagenesProductoDto extends PartialType(CreateImagenesProductoDto) {}

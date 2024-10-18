import { PartialType } from '@nestjs/mapped-types';
import { CreateTransferenciaProductoDto } from './create-transferencia-producto.dto';

export class UpdateTransferenciaProductoDto extends PartialType(CreateTransferenciaProductoDto) {}

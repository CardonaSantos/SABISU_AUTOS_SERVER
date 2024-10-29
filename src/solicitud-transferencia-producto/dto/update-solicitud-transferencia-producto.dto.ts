import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudTransferenciaProductoDto } from './create-solicitud-transferencia-producto.dto';

export class UpdateSolicitudTransferenciaProductoDto extends PartialType(CreateSolicitudTransferenciaProductoDto) {}

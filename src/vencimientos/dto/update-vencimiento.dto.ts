import { PartialType } from '@nestjs/mapped-types';
import { CreateVencimientoDto } from './create-vencimiento.dto';

export class UpdateVencimientoDto extends PartialType(CreateVencimientoDto) {}

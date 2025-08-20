import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoFinancieroDto } from './create-movimiento-financiero.dto';

export class UpdateMovimientoFinancieroDto extends PartialType(CreateMovimientoFinancieroDto) {}

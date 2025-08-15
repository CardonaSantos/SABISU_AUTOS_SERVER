import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientosCajaDto } from './create-movimientos-caja.dto';

export class UpdateMovimientosCajaDto extends PartialType(CreateMovimientosCajaDto) {}

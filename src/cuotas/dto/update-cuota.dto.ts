// update-venta-cuota.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVentaCuotaDto } from './create-ventacuota.dto';

export class UpdateVentaCuotaDto extends PartialType(CreateVentaCuotaDto) {}

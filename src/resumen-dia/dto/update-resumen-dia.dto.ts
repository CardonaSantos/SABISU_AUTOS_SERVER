import { PartialType } from '@nestjs/mapped-types';
import { CreateResumenDiaDto } from './create-resumen-dia.dto';

export class UpdateResumenDiaDto extends PartialType(CreateResumenDiaDto) {}

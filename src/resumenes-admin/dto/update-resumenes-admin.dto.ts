import { PartialType } from '@nestjs/mapped-types';
import { CreateResumenesAdminDto } from './create-resumenes-admin.dto';

export class UpdateResumenesAdminDto extends PartialType(CreateResumenesAdminDto) {}

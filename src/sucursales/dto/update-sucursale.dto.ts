import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursaleDto } from './create-sucursale.dto';

export class UpdateSucursaleDto extends PartialType(CreateSucursaleDto) {}

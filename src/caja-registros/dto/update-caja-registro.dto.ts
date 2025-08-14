import { PartialType } from '@nestjs/mapped-types';
import { CreateCajaRegistroDto } from './create-caja-registro.dto';

export class UpdateCajaRegistroDto extends PartialType(CreateCajaRegistroDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateCajaAdministrativoDto } from './create-caja-administrativo.dto';

export class UpdateCajaAdministrativoDto extends PartialType(CreateCajaAdministrativoDto) {}

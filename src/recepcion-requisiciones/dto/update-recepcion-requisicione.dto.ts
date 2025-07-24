import { PartialType } from '@nestjs/mapped-types';
import { CreateRecepcionRequisicioneDto } from './create-recepcion-requisicione.dto';

export class UpdateRecepcionRequisicioneDto extends PartialType(CreateRecepcionRequisicioneDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateRequisicionDto } from './create-requisicion.dto';

export class UpdateRequisicionDto extends PartialType(CreateRequisicionDto) {}

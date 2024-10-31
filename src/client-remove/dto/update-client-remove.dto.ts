import { PartialType } from '@nestjs/mapped-types';
import { CreateClientRemoveDto } from './create-client-remove.dto';

export class UpdateClientRemoveDto extends PartialType(CreateClientRemoveDto) {}

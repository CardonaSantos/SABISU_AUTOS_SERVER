import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDeletedDto } from './create-sale-deleted.dto';

export class UpdateSaleDeletedDto extends PartialType(CreateSaleDeletedDto) {}

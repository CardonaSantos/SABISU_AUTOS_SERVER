import { PartialType } from '@nestjs/mapped-types';
import { CreateStockRemoveDto } from './create-stock-remove.dto';

export class UpdateStockRemoveDto extends PartialType(CreateStockRemoveDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateMinimunStockDto } from './create-minimun-stock.dto';

export class UpdateMinimunStockDto extends PartialType(CreateMinimunStockDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateMinimunStockAlertDto } from './create-minimun-stock-alert.dto';

export class UpdateMinimunStockAlertDto extends PartialType(CreateMinimunStockAlertDto) {}

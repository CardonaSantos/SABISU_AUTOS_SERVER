import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialStockDto } from './create-historial-stock.dto';

export class UpdateHistorialStockDto extends PartialType(CreateHistorialStockDto) {}

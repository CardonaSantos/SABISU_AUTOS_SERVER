import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialStockTrackerDto } from './create-historial-stock-tracker.dto';

export class UpdateHistorialStockTrackerDto extends PartialType(CreateHistorialStockTrackerDto) {}

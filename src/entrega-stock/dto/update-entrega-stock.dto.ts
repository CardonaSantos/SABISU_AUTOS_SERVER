import { PartialType } from '@nestjs/mapped-types';
import { CreateEntregaStockDto } from './create-entrega-stock.dto';

export class UpdateEntregaStockDto extends PartialType(CreateEntregaStockDto) {}

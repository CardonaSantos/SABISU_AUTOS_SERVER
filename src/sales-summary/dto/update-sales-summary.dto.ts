import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesSummaryDto } from './create-sales-summary.dto';

export class UpdateSalesSummaryDto extends PartialType(CreateSalesSummaryDto) {}

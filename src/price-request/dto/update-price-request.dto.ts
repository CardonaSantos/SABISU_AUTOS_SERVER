import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceRequestDto } from './create-price-request.dto';

export class UpdatePriceRequestDto extends PartialType(CreatePriceRequestDto) {}

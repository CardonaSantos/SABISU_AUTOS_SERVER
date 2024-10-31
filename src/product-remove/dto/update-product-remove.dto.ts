import { PartialType } from '@nestjs/mapped-types';
import { CreateProductRemoveDto } from './create-product-remove.dto';

export class UpdateProductRemoveDto extends PartialType(CreateProductRemoveDto) {}

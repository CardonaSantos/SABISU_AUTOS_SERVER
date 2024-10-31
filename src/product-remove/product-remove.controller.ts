import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductRemoveService } from './product-remove.service';
import { CreateProductRemoveDto } from './dto/create-product-remove.dto';
import { UpdateProductRemoveDto } from './dto/update-product-remove.dto';

@Controller('product-remove')
export class ProductRemoveController {
  constructor(private readonly productRemoveService: ProductRemoveService) {}

  @Post()
  create(@Body() createProductRemoveDto: CreateProductRemoveDto) {
    return this.productRemoveService.create(createProductRemoveDto);
  }

  @Get()
  findAll() {
    return this.productRemoveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productRemoveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductRemoveDto: UpdateProductRemoveDto) {
    return this.productRemoveService.update(+id, updateProductRemoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productRemoveService.remove(+id);
  }
}

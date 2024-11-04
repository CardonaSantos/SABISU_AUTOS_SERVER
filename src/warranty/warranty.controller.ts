import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';

@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

  @Post()
  create(@Body() createWarrantyDto: CreateWarrantyDto) {
    return this.warrantyService.create(createWarrantyDto);
  }

  @Get()
  findAll() {
    return this.warrantyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warrantyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarrantyDto: UpdateWarrantyDto,
  ) {
    return this.warrantyService.update(+id, updateWarrantyDto);
  }

  @Delete('/delete-all')
  removeAll() {
    return this.warrantyService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warrantyService.remove(+id);
  }
}

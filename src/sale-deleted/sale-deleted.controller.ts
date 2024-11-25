import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SaleDeletedService } from './sale-deleted.service';
import { CreateSaleDeletedDto } from './dto/create-sale-deleted.dto';
import { UpdateSaleDeletedDto } from './dto/update-sale-deleted.dto';

@Controller('sale-deleted')
export class SaleDeletedController {
  constructor(private readonly saleDeletedService: SaleDeletedService) {}

  @Post()
  create(@Body() createSaleDeletedDto: CreateSaleDeletedDto) {
    return this.saleDeletedService.create(createSaleDeletedDto);
  }

  @Get()
  findAll() {
    return this.saleDeletedService.findAll();
  }

  @Get('/get-my-sales-deleted/:id')
  findMySalesDeleted(@Param('id', ParseIntPipe) id: number) {
    return this.saleDeletedService.findMySalesDeleted(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleDeletedService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleDeletedDto: UpdateSaleDeletedDto,
  ) {
    return this.saleDeletedService.update(+id, updateSaleDeletedDto);
  }

  @Delete('/remove-all')
  removeAll() {
    return this.saleDeletedService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleDeletedService.remove(+id);
  }
}

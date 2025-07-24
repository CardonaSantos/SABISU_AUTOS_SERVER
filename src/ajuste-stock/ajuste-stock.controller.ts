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
import { AjusteStockService } from './ajuste-stock.service';
import { CreateAjusteStockDto } from './dto/create-ajuste-stock.dto';
import { UpdateAjusteStockDto } from './dto/update-ajuste-stock.dto';

@Controller('ajuste-stock')
export class AjusteStockController {
  constructor(private readonly ajusteStockService: AjusteStockService) {}

  @Post()
  create(@Body() createAjusteStockDto: CreateAjusteStockDto) {
    return this.ajusteStockService.create(createAjusteStockDto);
  }

  @Get()
  findAll() {
    return this.ajusteStockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ajusteStockService.findOne(+id);
  }

  @Patch('/update-stock/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAjusteStockDto: UpdateAjusteStockDto,
  ) {
    return this.ajusteStockService.update(id, updateAjusteStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ajusteStockService.remove(+id);
  }
}

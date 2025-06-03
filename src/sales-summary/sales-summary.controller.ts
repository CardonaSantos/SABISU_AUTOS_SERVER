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
import { SalesSummaryService } from './sales-summary.service';
import { CreateSalesSummaryDto } from './dto/create-sales-summary.dto';
import { UpdateSalesSummaryDto } from './dto/update-sales-summary.dto';
import { CreateAutoSummary } from './dto/create-auto.dto';

@Controller('sales-summary')
export class SalesSummaryController {
  constructor(private readonly salesSummaryService: SalesSummaryService) {}

  @Post()
  create(@Body() createSalesSummaryDto: CreateSalesSummaryDto) {
    return this.salesSummaryService.create(createSalesSummaryDto);
  }

  @Post('/auto')
  createSummaryAuto(@Body() dto: CreateAutoSummary) {
    return this.salesSummaryService.createSummaryAuto(dto);
  }

  @Get()
  findAll() {
    return this.salesSummaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesSummaryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSalesSummaryDto: UpdateSalesSummaryDto,
  ) {
    return this.salesSummaryService.update(+id, updateSalesSummaryDto);
  }

  @Delete('/delete-one-summary/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesSummaryService.remove(id);
  }
}

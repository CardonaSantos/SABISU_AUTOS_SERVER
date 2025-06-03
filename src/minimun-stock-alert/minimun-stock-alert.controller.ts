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
import { MinimunStockAlertService } from './minimun-stock-alert.service';
import { CreateMinimunStockAlertDto } from './dto/create-minimun-stock-alert.dto';
import { UpdateMinimunStockAlertDto } from './dto/update-minimun-stock-alert.dto';

@Controller('minimun-stock-alert')
export class MinimunStockAlertController {
  constructor(
    private readonly minimunStockAlertService: MinimunStockAlertService,
  ) {}

  @Post('/create')
  create(@Body() createMinimunStockAlertDto: CreateMinimunStockAlertDto) {
    return this.minimunStockAlertService.create(createMinimunStockAlertDto);
  }

  @Get('/get-all/:id')
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.minimunStockAlertService.findAll();
  }

  @Get('/get-all-minimum-stocks-alert/:id')
  findAllMinimunStockAlerts(@Param('id', ParseIntPipe) id: number) {
    return this.minimunStockAlertService.findAllMinimunStockAlerts();
  }

  @Get('/get-one/:id')
  findOne(@Param('id') id: string) {
    return this.minimunStockAlertService.findOne(+id);
  }

  @Patch('/update-one/:id')
  update(
    @Param('id') id: string,
    @Body() updateMinimunStockAlertDto: UpdateMinimunStockAlertDto,
  ) {
    const { productoId, stockMinimo } = updateMinimunStockAlertDto;
    let dto: { stockMinimo: number };
    return this.minimunStockAlertService.update(productoId, dto);
  }

  @Delete('/delete-all')
  removeAll() {
    return this.minimunStockAlertService.removeAll();
  }

  @Delete('/delete-one/:id')
  remove(@Param('id') id: string) {
    return this.minimunStockAlertService.remove(+id);
  }
}

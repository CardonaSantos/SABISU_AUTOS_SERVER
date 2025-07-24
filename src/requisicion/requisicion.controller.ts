import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { RequisicionService } from './requisicion.service';
import { CreateRequisicionDto } from './dto/create-requisicion.dto';
import { UpdateRequisicionDto } from './dto/update-requisicion.dto';
import {
  CreateRequisitionDto,
  RequisitionResponse,
  StockAlertItem,
} from './utils';
import { UpdateRequisitionDto } from './dto/update-requisiciones.dto';

@Controller('requisicion')
export class RequisicionController {
  constructor(private readonly requisicionService: RequisicionService) {}

  /** Paso A: obtener productos con bajo stock */
  @Get('preview')
  findAlerts(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
  ): Promise<StockAlertItem[]> {
    return this.requisicionService.getStockAlerts(sucursalId);
  }

  @Get('requisicion-to-edit/:requisicionId')
  getRequisicionToEdit(
    @Param('requisicionId', ParseIntPipe) requisicionId: number,
  ): Promise<StockAlertItem[]> {
    return this.requisicionService.getRequisicionForEdit(requisicionId);
  }

  /** Paso C: crear requisición con las líneas seleccionadas */
  @Post()
  create(@Body() dto: CreateRequisitionDto): Promise<RequisitionResponse> {
    return this.requisicionService.createWithLines(dto);
  }

  @Get()
  findAll() {
    return this.requisicionService.findAll();
  }

  @Get('/one-requisicion/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.requisicionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequisicionDto: UpdateRequisicionDto,
  ) {
    return this.requisicionService.update(+id, updateRequisicionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.requisicionService.remove(id);
  }

  @Put('update')
  async updateRequisicion(@Body() dto: UpdateRequisitionDto) {
    return this.requisicionService.updateRequisitionWithLines(dto);
  }
}

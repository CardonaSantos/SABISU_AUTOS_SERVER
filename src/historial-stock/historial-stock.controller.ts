import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { HistorialStockService } from './historial-stock.service';
import { CreateHistorialStockDto } from './dto/create-historial-stock.dto';
import { UpdateHistorialStockDto } from './dto/update-historial-stock.dto';
import { TipoMovimientoStock } from '@prisma/client';
import { HistorialStockDTO } from './interfaces.interface';

@Controller('historial-stock')
export class HistorialStockController {
  constructor(private readonly historialStockService: HistorialStockService) {}

  @Post()
  create(@Body() createHistorialStockDto: CreateHistorialStockDto) {
    return this.historialStockService.create(createHistorialStockDto);
  }

  @Get('requisiciones')
  async getRequisicionesTracker(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getIngresoRequisicion({
      page,
      pageSize,
    });
  }

  @Get('salida-ventas')
  async getSalidaVentasTracker(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getSalidaVenta({
      page,
      pageSize,
    });
  }

  @Get('ajuste-stocks')
  async getAjusteStocksTracker(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getAjusteStock({
      page,
      pageSize,
    });
  }

  @Get('eliminacion-stock')
  async getEliminacionStockTracker(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getEliminacionStock({
      page,
      pageSize,
    });
  }

  @Get('venta-eliminada')
  async getVentasEliminadasTracker(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getEliminacionVenta({
      page,
      pageSize,
    });
  }

  @Get('transferencia-stock')
  async getTransferenciaStock(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getTransferencia({
      page,
      pageSize,
    });
  }

  @Get('entregas-stock')
  async getEntregasStock(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getEntregaStock({
      page,
      pageSize,
    });
  }

  @Get()
  async findAll(
    @Query('tipo') tipo?: TipoMovimientoStock,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize = 20,
  ) {
    return this.historialStockService.getHistorialStockCambios({
      tipo,
      page,
      pageSize,
    });
  }

  @Delete()
  async deleteAll() {
    return this.historialStockService.deleteAll();
  }
}

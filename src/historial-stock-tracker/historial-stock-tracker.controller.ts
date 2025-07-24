import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HistorialStockTrackerService } from './historial-stock-tracker.service';
import { CreateHistorialStockTrackerDto } from './dto/create-historial-stock-tracker.dto';
import { UpdateHistorialStockTrackerDto } from './dto/update-historial-stock-tracker.dto';

@Controller('historial-stock-tracker')
export class HistorialStockTrackerController {
  constructor(
    private readonly historialStockTrackerService: HistorialStockTrackerService,
  ) {}

  @Post()
  create(
    @Body() createHistorialStockTrackerDto: CreateHistorialStockTrackerDto,
  ) {
    return this.historialStockTrackerService.create(
      createHistorialStockTrackerDto,
    );
  }
}

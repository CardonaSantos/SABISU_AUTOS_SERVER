import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AjusteStockService } from 'src/ajuste-stock/ajuste-stock.service';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Module({
  controllers: [StockController],
  providers: [
    StockService,
    PrismaService,
    AjusteStockService,
    HistorialStockTrackerService,
  ],
})
export class StockModule {}

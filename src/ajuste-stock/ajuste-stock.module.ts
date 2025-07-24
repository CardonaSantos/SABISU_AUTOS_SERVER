import { Module } from '@nestjs/common';
import { AjusteStockService } from './ajuste-stock.service';
import { AjusteStockController } from './ajuste-stock.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Module({
  controllers: [AjusteStockController],
  providers: [AjusteStockService, PrismaService, HistorialStockTrackerService],
})
export class AjusteStockModule {}

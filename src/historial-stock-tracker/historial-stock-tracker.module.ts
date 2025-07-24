import { Module } from '@nestjs/common';
import { HistorialStockTrackerService } from './historial-stock-tracker.service';
import { HistorialStockTrackerController } from './historial-stock-tracker.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HistorialStockTrackerController],
  providers: [HistorialStockTrackerService, PrismaService],
})
export class HistorialStockTrackerModule {}

import { Module } from '@nestjs/common';
import { SaleDeletedService } from './sale-deleted.service';
import { SaleDeletedController } from './sale-deleted.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Module({
  controllers: [SaleDeletedController],
  providers: [SaleDeletedService, PrismaService, HistorialStockTrackerService],
})
export class SaleDeletedModule {}

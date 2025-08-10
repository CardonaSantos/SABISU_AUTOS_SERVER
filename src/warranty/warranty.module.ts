import { Module } from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { WarrantyController } from './warranty.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Module({
  controllers: [WarrantyController],
  providers: [WarrantyService, PrismaService, HistorialStockTrackerService],
})
export class WarrantyModule {}

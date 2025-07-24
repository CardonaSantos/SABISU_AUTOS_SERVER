import { Module } from '@nestjs/common';
import { HistorialStockService } from './historial-stock.service';
import { HistorialStockController } from './historial-stock.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HistorialStockController],
  providers: [HistorialStockService, PrismaService],
})
export class HistorialStockModule {}

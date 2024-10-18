import { Module } from '@nestjs/common';
import { EntregaStockService } from './entrega-stock.service';
import { EntregaStockController } from './entrega-stock.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EntregaStockController],
  providers: [EntregaStockService, PrismaService],
})
export class EntregaStockModule {}

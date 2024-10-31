import { Module } from '@nestjs/common';
import { AjusteStockService } from './ajuste-stock.service';
import { AjusteStockController } from './ajuste-stock.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AjusteStockController],
  providers: [AjusteStockService, PrismaService],
})
export class AjusteStockModule {}

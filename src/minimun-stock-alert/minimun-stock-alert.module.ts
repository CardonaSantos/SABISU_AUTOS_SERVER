import { Module } from '@nestjs/common';
import { MinimunStockAlertService } from './minimun-stock-alert.service';
import { MinimunStockAlertController } from './minimun-stock-alert.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MinimunStockAlertController],
  providers: [MinimunStockAlertService, PrismaService],
})
export class MinimunStockAlertModule {}

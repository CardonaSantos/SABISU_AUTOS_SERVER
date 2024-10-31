import { Module } from '@nestjs/common';
import { StockRemoveService } from './stock-remove.service';
import { StockRemoveController } from './stock-remove.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StockRemoveController],
  providers: [StockRemoveService, PrismaService],
})
export class StockRemoveModule {}

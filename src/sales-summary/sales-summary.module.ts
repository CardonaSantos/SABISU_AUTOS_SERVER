import { Module } from '@nestjs/common';
import { SalesSummaryService } from './sales-summary.service';
import { SalesSummaryController } from './sales-summary.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SalesSummaryController],
  providers: [SalesSummaryService, PrismaService],
})
export class SalesSummaryModule {}

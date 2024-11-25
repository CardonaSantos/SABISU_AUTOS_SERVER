import { Module } from '@nestjs/common';
import { SaleDeletedService } from './sale-deleted.service';
import { SaleDeletedController } from './sale-deleted.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SaleDeletedController],
  providers: [SaleDeletedService, PrismaService],
})
export class SaleDeletedModule {}

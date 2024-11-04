import { Module } from '@nestjs/common';
import { WarrantyService } from './warranty.service';
import { WarrantyController } from './warranty.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [WarrantyController],
  providers: [WarrantyService, PrismaService],
})
export class WarrantyModule {}

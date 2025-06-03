import { Module } from '@nestjs/common';
import { RequisicionService } from './requisicion.service';
import { RequisicionController } from './requisicion.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RequisicionController],
  providers: [RequisicionService, PrismaService],
})
export class RequisicionModule {}

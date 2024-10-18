import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';

@Module({
  // controllers: [PrismaController],// COMO NO SE USA COMO CONTROLLER, NO LO USAMOS
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

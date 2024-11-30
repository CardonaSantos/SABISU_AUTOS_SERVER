import { Module } from '@nestjs/common';
import { CuotasService } from './cuotas.service';
import { CuotasController } from './cuotas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CuotasController],
  providers: [CuotasService, PrismaService],
})
export class CuotasModule {}

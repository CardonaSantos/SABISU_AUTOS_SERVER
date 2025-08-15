import { Module } from '@nestjs/common';
import { MovimientosCajasService } from './movimientos-cajas.service';
import { MovimientosCajasController } from './movimientos-cajas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MovimientosCajasController],
  providers: [MovimientosCajasService, PrismaService],
})
export class MovimientosCajasModule {}

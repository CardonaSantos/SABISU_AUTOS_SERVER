import { Module } from '@nestjs/common';
import { MovimientoCajaService } from './movimiento-caja.service';
import { MovimientoCajaController } from './movimiento-caja.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MovimientoCajaController],
  providers: [MovimientoCajaService, PrismaService],
})
export class MovimientoCajaModule {}

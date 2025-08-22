import { Module } from '@nestjs/common';
import { MovimientoFinancieroService } from './movimiento-financiero.service';
import { MovimientoFinancieroController } from './movimiento-financiero.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';

@Module({
  controllers: [MovimientoFinancieroController],
  providers: [MovimientoFinancieroService, PrismaService, UtilitiesService],
})
export class MovimientoFinancieroModule {}

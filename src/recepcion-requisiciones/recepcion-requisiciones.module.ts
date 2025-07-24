import { Module } from '@nestjs/common';
import { RecepcionRequisicionesService } from './recepcion-requisiciones.service';
import { RecepcionRequisicionesController } from './recepcion-requisiciones.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Module({
  controllers: [RecepcionRequisicionesController],
  providers: [
    RecepcionRequisicionesService,
    PrismaService,
    UtilitiesService,
    HistorialStockTrackerService,
  ],
})
export class RecepcionRequisicionesModule {}

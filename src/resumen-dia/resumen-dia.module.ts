import { Module } from '@nestjs/common';
import { ResumenDiaService } from './resumen-dia.service';
import { ResumenDiaController } from './resumen-dia.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilidadesService } from 'src/caja/utilidades/utilidades.service';

@Module({
  controllers: [ResumenDiaController],
  providers: [ResumenDiaService, PrismaService, UtilidadesService],
})
export class ResumenDiaModule {}

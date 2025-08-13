import { Module } from '@nestjs/common';
import { CajaController } from './caja.controller';
import { CajaService } from './caja.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilidadesService } from './utilidades/utilidades.service';

@Module({
  imports: [PrismaModule], // o si no tienes PrismaModule, deja PrismaService en providers
  controllers: [CajaController],
  providers: [CajaService, UtilidadesService], // ✅ usa UtilidadesService (no UtilitiesService)
  exports: [CajaService], // opcional si otros módulos lo usan
})
export class CajaModule {}

import { Module } from '@nestjs/common';
import { CajaController } from './caja.controller';
import { CajaService } from './caja.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UtilitiesModule } from 'src/utilities/utilities.module';

@Module({
  imports: [PrismaModule, UtilitiesModule], // 👈 importa el módulo
  controllers: [CajaController],
  providers: [CajaService], // 👈 ya NO declares UtilitiesService ni PrismaService aquí
  exports: [CajaService],
})
export class CajaModule {}

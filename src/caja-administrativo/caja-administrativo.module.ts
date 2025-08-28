import { Module } from '@nestjs/common';
import { CajaAdministrativoService } from './caja-administrativo.service';
import { CajaAdministrativoController } from './caja-administrativo.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CajaAdministrativoController],
  providers: [CajaAdministrativoService, PrismaService],
})
export class CajaAdministrativoModule {}

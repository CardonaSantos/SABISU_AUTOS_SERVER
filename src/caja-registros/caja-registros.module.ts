import { Module } from '@nestjs/common';
import { CajaRegistrosService } from './caja-registros.service';
import { CajaRegistrosController } from './caja-registros.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CajaRegistrosController],
  providers: [CajaRegistrosService, PrismaService],
})
export class CajaRegistrosModule {}

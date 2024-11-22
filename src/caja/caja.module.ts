import { Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CajaController],
  providers: [CajaService, PrismaService],
})
export class CajaModule {}

import { Module } from '@nestjs/common';
import { CuentasBancariasService } from './cuentas-bancarias.service';
import { CuentasBancariasController } from './cuentas-bancarias.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CuentasBancariasController],
  providers: [CuentasBancariasService, PrismaService],
})
export class CuentasBancariasModule {}

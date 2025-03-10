import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
// import { PrismaCrmService } from 'src/prisma/crm/crm.service';

@Module({
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
// PrismaCrmService
export class EmpresaModule {}

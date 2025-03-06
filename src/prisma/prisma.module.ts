import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaController } from './prisma.controller';
// import { CrmModule } from './crm/crm.module';
// import { CrmModule } from './crm/crm.module';

@Module({
  // controllers: [PrismaController],// COMO NO SE USA COMO CONTROLLER, NO LO USAMOS
  providers: [PrismaService],
  exports: [PrismaService],
  // imports: [CrmModule],
})
export class PrismaModule {}

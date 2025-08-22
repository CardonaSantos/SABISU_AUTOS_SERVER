import { Module } from '@nestjs/common';
import { ResumenesAdminService } from './resumenes-admin.service';
import { ResumenesAdminController } from './resumenes-admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ResumenesAdminController],
  providers: [ResumenesAdminService, PrismaService],
})
export class ResumenesAdminModule {}

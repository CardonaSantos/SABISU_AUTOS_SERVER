import { Global, Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
  controllers: [UtilitiesController],
  providers: [UtilitiesService, PrismaService],
  exports: [UtilitiesService],
})
export class UtilitiesModule {}

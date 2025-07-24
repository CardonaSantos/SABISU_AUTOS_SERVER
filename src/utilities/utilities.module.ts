import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UtilitiesController],
  providers: [UtilitiesService, PrismaService],
})
export class UtilitiesModule {}

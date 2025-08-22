import { Module } from '@nestjs/common';
import { CronSnapshootService } from './cron-snapshoot.service';
import { CronSnapshootController } from './cron-snapshoot.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaldosServiceUtilService } from './saldos-service-util/saldos-service-util.service';

@Module({
  controllers: [CronSnapshootController],
  providers: [CronSnapshootService, PrismaService, SaldosServiceUtilService],
})
export class CronSnapshootModule {}

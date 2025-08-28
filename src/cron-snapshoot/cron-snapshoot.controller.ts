import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CronSnapshootService } from './cron-snapshoot.service';
import { CreateCronSnapshootDto } from './dto/create-cron-snapshoot.dto';
import { UpdateCronSnapshootDto } from './dto/update-cron-snapshoot.dto';
import { SeedYesterdaySnapshotDto } from './dto/seed-yesterday-snapshot.dto';

@Controller('cron-snapshoot')
export class CronSnapshootController {
  constructor(private readonly cronSnapshootService: CronSnapshootService) {}

  @Get('get-all')
  getAllRegistros() {
    return this.cronSnapshootService.getAllRegistros();
  }

  @Delete('delete-all')
  removeAll() {
    return this.cronSnapshootService.deleteAllSnapshoots();
  }

  @Get('seed-week')
  async seedWeek(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
    @Query('usuarioId') usuarioId?: number,
  ) {
    return this.cronSnapshootService.seedLastWeek({
      sucursalId,
      usuarioId: usuarioId ? Number(usuarioId) : undefined,
    });
  }

  @Post('seed-yesterday')
  async seedYesterday(@Body() dto: SeedYesterdaySnapshotDto) {
    return this.cronSnapshootService.seedYesterday(dto);
  }
}

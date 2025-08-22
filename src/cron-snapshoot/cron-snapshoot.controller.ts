import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CronSnapshootService } from './cron-snapshoot.service';
import { CreateCronSnapshootDto } from './dto/create-cron-snapshoot.dto';
import { UpdateCronSnapshootDto } from './dto/update-cron-snapshoot.dto';

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
}

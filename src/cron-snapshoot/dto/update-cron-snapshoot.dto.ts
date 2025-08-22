import { PartialType } from '@nestjs/mapped-types';
import { CreateCronSnapshootDto } from './create-cron-snapshoot.dto';

export class UpdateCronSnapshootDto extends PartialType(CreateCronSnapshootDto) {}

import { Controller } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}
}

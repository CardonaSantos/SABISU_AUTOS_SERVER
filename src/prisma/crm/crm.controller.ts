import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PrismaCrmService } from './crm.service';
import { CreateCrmDto } from './dto/create-crm.dto';
import { UpdateCrmDto } from './dto/update-crm.dto';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: PrismaCrmService) {}
}

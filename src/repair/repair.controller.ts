import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RepairService } from './repair.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { updateRepair } from './dto/updateRepair.dto';
import { closeRepairRegist } from './dto/close-regist-repair.dto';

@Controller('repair')
export class RepairController {
  constructor(private readonly repairService: RepairService) {}

  @Post()
  create(@Body() createRepairDto: CreateRepairDto) {
    return this.repairService.create(createRepairDto);
  }

  @Get()
  findAll() {
    return this.repairService.findAll();
  }

  @Get('/repair-to-pdf/:id')
  findOneRepairToPDF(@Param('id', ParseIntPipe) id: number) {
    return this.repairService.findOneRepairToPDF(id);
  }

  @Get('/repair-to-pdf-final/:id')
  findOneRepairToPdfFinal(@Param('id', ParseIntPipe) id: number) {
    return this.repairService.findOneRepairToPdfFinal(id);
  }

  @Get('/get-regist-open-repair')
  findRegistOpen() {
    return this.repairService.findRegistOpen();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairService.findOne(+id);
  }

  @Patch('/update-repair/:id')
  updateRepair(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRepairDto: updateRepair,
  ) {
    return this.repairService.updateRepair(id, updateRepairDto);
  }

  @Patch('/close-regist-repair/:id')
  closeRepairRegist(
    @Param('id', ParseIntPipe) id: number,
    @Body() closeRegistRepairDTO: closeRepairRegist,
  ) {
    return this.repairService.closeRepairRegist(id, closeRegistRepairDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairDto: UpdateRepairDto) {
    return this.repairService.update(+id, updateRepairDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientRemoveService } from './client-remove.service';
import { CreateClientRemoveDto } from './dto/create-client-remove.dto';
import { UpdateClientRemoveDto } from './dto/update-client-remove.dto';

@Controller('client-remove')
export class ClientRemoveController {
  constructor(private readonly clientRemoveService: ClientRemoveService) {}

  @Post()
  create(@Body() createClientRemoveDto: CreateClientRemoveDto) {
    return this.clientRemoveService.create(createClientRemoveDto);
  }

  @Get()
  findAll() {
    return this.clientRemoveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientRemoveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientRemoveDto: UpdateClientRemoveDto) {
    return this.clientRemoveService.update(+id, updateClientRemoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientRemoveService.remove(+id);
  }
}

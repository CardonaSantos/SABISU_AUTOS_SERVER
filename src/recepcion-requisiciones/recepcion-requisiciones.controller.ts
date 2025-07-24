import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecepcionRequisicionesService } from './recepcion-requisiciones.service';
import { CreateRecepcionRequisicioneDto } from './dto/create-recepcion-requisicione.dto';
import { UpdateRecepcionRequisicioneDto } from './dto/update-recepcion-requisicione.dto';
import {
  CreateRequisicionRecepcionDto,
  CreateRequisicionRecepcionLineaDto,
} from './dto/requisicion-recepcion-create.dto';

@Controller('recepcion-requisiciones')
export class RecepcionRequisicionesController {
  constructor(
    private readonly recepcionRequisicionesService: RecepcionRequisicionesService,
  ) {}

  @Post('/make-re-enter-producto')
  makeRecepcionRequisicion(
    @Body() createRecepcionRequisicioneDto: CreateRequisicionRecepcionDto,
  ) {
    return this.recepcionRequisicionesService.makeRecepcionRequisicion(
      createRecepcionRequisicioneDto,
    );
  }

  @Get()
  findAll() {
    return this.recepcionRequisicionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recepcionRequisicionesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecepcionRequisicioneDto: UpdateRecepcionRequisicioneDto,
  ) {
    return this.recepcionRequisicionesService.update(
      +id,
      updateRecepcionRequisicioneDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recepcionRequisicionesService.remove(+id);
  }
}

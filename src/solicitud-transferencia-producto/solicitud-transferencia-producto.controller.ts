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
import { SolicitudTransferenciaProductoService } from './solicitud-transferencia-producto.service';
import { CreateSolicitudTransferenciaProductoDto } from './dto/create-solicitud-transferencia-producto.dto';
import { UpdateSolicitudTransferenciaProductoDto } from './dto/update-solicitud-transferencia-producto.dto';

@Controller('solicitud-transferencia-producto')
export class SolicitudTransferenciaProductoController {
  constructor(
    private readonly solicitudTransferenciaProductoService: SolicitudTransferenciaProductoService,
  ) {}

  @Post()
  create(
    @Body()
    createSolicitudTransferenciaProductoDto: CreateSolicitudTransferenciaProductoDto,
  ) {
    return this.solicitudTransferenciaProductoService.create(
      createSolicitudTransferenciaProductoDto,
    );
  }

  @Post('aceptar')
  async aceptarTransferencia(
    @Body('idSolicitudTransferencia') idSolicitudTransferencia: number,
    @Body('userID') userID: number,
  ) {
    return this.solicitudTransferenciaProductoService.createTransferencia(
      idSolicitudTransferencia,
      userID,
    );
  }

  @Delete('/rechazar/:idSolicitudTransferencia/:userID')
  async rechazarTransferencia(
    @Param('idSolicitudTransferencia', ParseIntPipe)
    idSolicitudTransferencia: number,
    @Param('userID', ParseIntPipe) userID: number,
  ) {
    return this.solicitudTransferenciaProductoService.rechazarTransferencia(
      idSolicitudTransferencia,
      userID,
    );
  }

  @Get()
  findAll() {
    return this.solicitudTransferenciaProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudTransferenciaProductoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateSolicitudTransferenciaProductoDto: UpdateSolicitudTransferenciaProductoDto,
  ) {
    return this.solicitudTransferenciaProductoService.update(
      +id,
      updateSolicitudTransferenciaProductoDto,
    );
  }

  @Delete('/delete-all')
  removeAll() {
    return this.solicitudTransferenciaProductoService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitudTransferenciaProductoService.remove(+id);
  }
}

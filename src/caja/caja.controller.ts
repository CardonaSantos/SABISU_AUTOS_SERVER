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
import { CajaService } from './caja.service';
import { IniciarCaja } from './dto/open-regist.dto';
import { CerrarCaja } from './dto/cerrar-caja.dto';

@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  //ABRIR EL REGISTRO DE CAJA [TURNO]
  @Post('/iniciar-caja')
  createRegistCash(@Body() createCajaDto: IniciarCaja) {
    return this.cajaService.iniciarCaja(createCajaDto);
  }

  //CERRAR LA CAJA
  @Patch('/cerrar-caja')
  create(@Body() dto: CerrarCaja) {
    return this.cajaService.cerrarCaja(dto);
  }

  @Get('/get-ultimo-saldo-sucursal/:sucursalID')
  getUltimoSaldoSucursal(
    @Param('sucursalID', ParseIntPipe) sucursalID: number,
  ) {
    return this.cajaService.getSaldoInicial(sucursalID);
  }

  //CONSEGUIR REGISTRO DE CAJA SIN CERRAR DE MI USUSARIO EN CIERTA SUCURSAL
  @Get('/find-cash-regist-open/:sucursalID/:userID')
  findOpenCashRegist(
    @Param('sucursalID', ParseIntPipe) sucursalID: number,
    @Param('userID', ParseIntPipe) userID: number,
  ) {
    const dto = {
      sucursalID: sucursalID,
      userID: userID,
    };
    return this.cajaService.conseguirCajaAbierta(dto);
  }

  @Get('/get-previo-cierre/:sucursalID/:userID')
  getMontoPrevio(
    @Param('sucursalID', ParseIntPipe) sucursalID: number,
    @Param('userID', ParseIntPipe) userID: number,
  ) {
    const dto = {
      sucursalId: sucursalID,
      usuarioId: userID,
    };
    return this.cajaService.previewCierre(dto);
  }

  //CONSEGUIR REGISTRO DE CAJA SIN CERRAR DE MI USUSARIO EN CIERTA SUCURSAL
  @Get('/get-cajas-registros')
  getCajasRegistros() {
    return this.cajaService.getCajasRegistros();
  }

  @Get('/get-cajas-registros-ventas/:id')
  getVentasDeCaja(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.getVentasLigadasACaja(id);
  }

  @Delete('/delete-all')
  deletAllCajas() {
    return this.cajaService.deleteAllCajas();
  }
}

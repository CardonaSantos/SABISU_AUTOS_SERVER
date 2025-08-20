import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CajaService } from './caja.service';
import { IniciarCaja } from './dto/open-regist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CerrarCajaDto } from './dto/CerrarCajaDto';
import { CerrarCajaV2Dto } from './cerrarCajaTypes';
import { GetCajasQueryDto } from './GetCajasQueryDto ';

@Controller('caja')
export class CajaController {
  constructor(
    private readonly cajaService: CajaService,

    private readonly prisma: PrismaService,
  ) {}

  //ABRIR EL REGISTRO DE CAJA [TURNO]
  @Post('/iniciar-caja')
  createRegistCash(@Body() createCajaDto: IniciarCaja) {
    return this.cajaService.iniciarCaja(createCajaDto);
  }

  @Post('/cerrar-v2')
  cerrarCajaAdvanced(@Body() dto: CerrarCajaV2Dto) {
    return this.cajaService.cerrarCajaV2(dto);
  }

  //CERRAR LA CAJA
  @Patch('/cerrar-caja')
  create(@Body() dto: CerrarCajaDto) {
    return this.cajaService.cerrarCaja(dto);
  }
  @Get('/get-ultimo-saldo-sucursal/:sucursalID')
  getUltimoSaldoSucursal(
    @Param('sucursalID', ParseIntPipe) sucursalID: number,
  ) {
    return this.cajaService.getUltimoSaldoSucursal(sucursalID);
  }

  @Get('previa-cierre')
  getPreviaCierre(
    @Query()
    q: {
      registroCajaId?: string;
      sucursalId?: string;
      usuarioId?: string;
    },
  ) {
    const registroCajaId = q.registroCajaId
      ? Number(q.registroCajaId)
      : undefined;
    const sucursalId = q.sucursalId ? Number(q.sucursalId) : undefined;
    const usuarioId = q.usuarioId ? Number(q.usuarioId) : undefined;

    return this.cajaService.previewCierre({
      registroCajaId,
      sucursalId,
      usuarioId,
    });
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
    return this.cajaService.conseguirCajaAbierta(dto.sucursalID);
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

  @Get('/get-all-cajas')
  getAllCajas() {
    return this.cajaService.getAllCajas();
  }

  @Delete('/delete-all')
  deletAllCajas() {
    return this.cajaService.deleteAllCajas();
  }

  @Get('list-cajas')
  list(@Query() dto: GetCajasQueryDto) {
    return this.cajaService.list(dto);
  }
}

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
import { TransferenciaProductoService } from './transferencia-producto.service';
import { CreateTransferenciaProductoDto } from './dto/create-transferencia-producto.dto';
import { UpdateTransferenciaProductoDto } from './dto/update-transferencia-producto.dto';

@Controller('transferencia-producto')
export class TransferenciaProductoController {
  constructor(
    private readonly transferenciaProductoService: TransferenciaProductoService,
  ) {}

  @Post()
  create(
    @Body() createTransferenciaProductoDto: CreateTransferenciaProductoDto,
  ) {
    return this.transferenciaProductoService.transferirProducto(
      createTransferenciaProductoDto,
    );
  }

  @Get()
  findAll() {
    return this.transferenciaProductoService.findAll();
  }

  @Get('/get-my-translates/:id')
  findMyTranslateProducts(@Param('id', ParseIntPipe) id: number) {
    console.log('Entrando al controller, el id es: ', id);

    return this.transferenciaProductoService.findAllMytranslates(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciaProductoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransferenciaProductoDto: UpdateTransferenciaProductoDto,
  ) {
    return this.transferenciaProductoService.update(
      +id,
      updateTransferenciaProductoDto,
    );
  }

  @Delete()
  removeAll() {
    return this.transferenciaProductoService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciaProductoService.remove(+id);
  }
}

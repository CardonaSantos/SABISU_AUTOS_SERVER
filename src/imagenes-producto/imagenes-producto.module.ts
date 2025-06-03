import { Module } from '@nestjs/common';
import { ImagenesProductoService } from './imagenes-producto.service';
import { ImagenesProductoController } from './imagenes-producto.controller';

@Module({
  controllers: [ImagenesProductoController],
  providers: [ImagenesProductoService],
})
export class ImagenesProductoModule {}

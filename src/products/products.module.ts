import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinimunStockAlertService } from 'src/minimun-stock-alert/minimun-stock-alert.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    MinimunStockAlertService,
    CloudinaryService,
  ],
})
export class ProductsModule {}

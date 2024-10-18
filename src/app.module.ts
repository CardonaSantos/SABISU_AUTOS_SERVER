import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { StockModule } from './stock/stock.module';
import { VentaModule } from './venta/venta.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { CategoriaModule } from './categoria/categoria.module';
import { VentaProductoModule } from './venta-producto/venta-producto.module';
import { EntregaStockModule } from './entrega-stock/entrega-stock.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ProductsModule,
    StockModule,
    VentaModule,
    ProveedorModule,
    CategoriaModule,
    VentaProductoModule,
    EntregaStockModule,
    AnalyticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

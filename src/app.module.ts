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
import { ConfigModule } from '@nestjs/config';
import { SucursalesModule } from './sucursales/sucursales.module';
import { TransferenciaProductoModule } from './transferencia-producto/transferencia-producto.module';
import { GatewayModule } from './web-sockets/websocket.module';
import { NotificationModule } from './notification/notification.module';
import { PriceRequestModule } from './price-request/price-request.module';
import { SolicitudTransferenciaProductoModule } from './solicitud-transferencia-producto/solicitud-transferencia-producto.module';

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
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigService esté disponible en toda la aplicación
    }),
    SucursalesModule,
    TransferenciaProductoModule,
    //SOCKETSSSSSS
    GatewayModule,
    NotificationModule,
    PriceRequestModule,
    SolicitudTransferenciaProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module, forwardRef } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
// import { NotificationModule } from 'src/notification/notification.module';

@Module({
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class GatewayModule {}

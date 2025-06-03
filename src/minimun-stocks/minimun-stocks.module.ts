import { Module } from '@nestjs/common';
import { MinimunStocksService } from './minimun-stocks.service';
import { MinimunStocksController } from './minimun-stocks.controller';

@Module({
  controllers: [MinimunStocksController],
  providers: [MinimunStocksService],
})
export class MinimunStocksModule {}

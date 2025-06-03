import { Test, TestingModule } from '@nestjs/testing';
import { MinimunStocksController } from './minimun-stocks.controller';
import { MinimunStocksService } from './minimun-stocks.service';

describe('MinimunStocksController', () => {
  let controller: MinimunStocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MinimunStocksController],
      providers: [MinimunStocksService],
    }).compile();

    controller = module.get<MinimunStocksController>(MinimunStocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

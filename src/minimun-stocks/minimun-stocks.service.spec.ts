import { Test, TestingModule } from '@nestjs/testing';
import { MinimunStocksService } from './minimun-stocks.service';

describe('MinimunStocksService', () => {
  let service: MinimunStocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinimunStocksService],
    }).compile();

    service = module.get<MinimunStocksService>(MinimunStocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

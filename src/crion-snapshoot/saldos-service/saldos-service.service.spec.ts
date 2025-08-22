import { Test, TestingModule } from '@nestjs/testing';
import { SaldosServiceService } from './saldos-service.service';

describe('SaldosServiceService', () => {
  let service: SaldosServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaldosServiceService],
    }).compile();

    service = module.get<SaldosServiceService>(SaldosServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

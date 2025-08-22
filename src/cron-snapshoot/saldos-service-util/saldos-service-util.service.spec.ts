import { Test, TestingModule } from '@nestjs/testing';
import { SaldosServiceUtilService } from './saldos-service-util.service';

describe('SaldosServiceUtilService', () => {
  let service: SaldosServiceUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaldosServiceUtilService],
    }).compile();

    service = module.get<SaldosServiceUtilService>(SaldosServiceUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

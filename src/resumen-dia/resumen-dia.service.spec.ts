import { Test, TestingModule } from '@nestjs/testing';
import { ResumenDiaService } from './resumen-dia.service';

describe('ResumenDiaService', () => {
  let service: ResumenDiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResumenDiaService],
    }).compile();

    service = module.get<ResumenDiaService>(ResumenDiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

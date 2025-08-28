import { Test, TestingModule } from '@nestjs/testing';
import { CajaAdministrativoService } from './caja-administrativo.service';

describe('CajaAdministrativoService', () => {
  let service: CajaAdministrativoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CajaAdministrativoService],
    }).compile();

    service = module.get<CajaAdministrativoService>(CajaAdministrativoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

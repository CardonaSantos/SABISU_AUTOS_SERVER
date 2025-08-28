import { Test, TestingModule } from '@nestjs/testing';
import { CajaAdministrativoController } from './caja-administrativo.controller';
import { CajaAdministrativoService } from './caja-administrativo.service';

describe('CajaAdministrativoController', () => {
  let controller: CajaAdministrativoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CajaAdministrativoController],
      providers: [CajaAdministrativoService],
    }).compile();

    controller = module.get<CajaAdministrativoController>(CajaAdministrativoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

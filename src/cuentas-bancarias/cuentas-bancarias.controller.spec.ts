import { Test, TestingModule } from '@nestjs/testing';
import { CuentasBancariasController } from './cuentas-bancarias.controller';
import { CuentasBancariasService } from './cuentas-bancarias.service';

describe('CuentasBancariasController', () => {
  let controller: CuentasBancariasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuentasBancariasController],
      providers: [CuentasBancariasService],
    }).compile();

    controller = module.get<CuentasBancariasController>(CuentasBancariasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

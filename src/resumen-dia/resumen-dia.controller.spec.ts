import { Test, TestingModule } from '@nestjs/testing';
import { ResumenDiaController } from './resumen-dia.controller';
import { ResumenDiaService } from './resumen-dia.service';

describe('ResumenDiaController', () => {
  let controller: ResumenDiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumenDiaController],
      providers: [ResumenDiaService],
    }).compile();

    controller = module.get<ResumenDiaController>(ResumenDiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

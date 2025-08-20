import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoFinancieroController } from './movimiento-financiero.controller';
import { MovimientoFinancieroService } from './movimiento-financiero.service';

describe('MovimientoFinancieroController', () => {
  let controller: MovimientoFinancieroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientoFinancieroController],
      providers: [MovimientoFinancieroService],
    }).compile();

    controller = module.get<MovimientoFinancieroController>(MovimientoFinancieroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

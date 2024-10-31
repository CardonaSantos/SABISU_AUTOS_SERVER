import { Test, TestingModule } from '@nestjs/testing';
import { ProductRemoveController } from './product-remove.controller';
import { ProductRemoveService } from './product-remove.service';

describe('ProductRemoveController', () => {
  let controller: ProductRemoveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductRemoveController],
      providers: [ProductRemoveService],
    }).compile();

    controller = module.get<ProductRemoveController>(ProductRemoveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

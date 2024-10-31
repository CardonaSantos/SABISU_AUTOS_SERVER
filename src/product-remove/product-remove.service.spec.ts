import { Test, TestingModule } from '@nestjs/testing';
import { ProductRemoveService } from './product-remove.service';

describe('ProductRemoveService', () => {
  let service: ProductRemoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductRemoveService],
    }).compile();

    service = module.get<ProductRemoveService>(ProductRemoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

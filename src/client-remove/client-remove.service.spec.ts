import { Test, TestingModule } from '@nestjs/testing';
import { ClientRemoveService } from './client-remove.service';

describe('ClientRemoveService', () => {
  let service: ClientRemoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientRemoveService],
    }).compile();

    service = module.get<ClientRemoveService>(ClientRemoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

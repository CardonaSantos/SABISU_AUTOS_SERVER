import { Test, TestingModule } from '@nestjs/testing';
import { ClientRemoveController } from './client-remove.controller';
import { ClientRemoveService } from './client-remove.service';

describe('ClientRemoveController', () => {
  let controller: ClientRemoveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientRemoveController],
      providers: [ClientRemoveService],
    }).compile();

    controller = module.get<ClientRemoveController>(ClientRemoveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

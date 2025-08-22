import { Test, TestingModule } from '@nestjs/testing';
import { ResumenesAdminController } from './resumenes-admin.controller';
import { ResumenesAdminService } from './resumenes-admin.service';

describe('ResumenesAdminController', () => {
  let controller: ResumenesAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumenesAdminController],
      providers: [ResumenesAdminService],
    }).compile();

    controller = module.get<ResumenesAdminController>(ResumenesAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

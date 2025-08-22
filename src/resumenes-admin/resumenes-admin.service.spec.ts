import { Test, TestingModule } from '@nestjs/testing';
import { ResumenesAdminService } from './resumenes-admin.service';

describe('ResumenesAdminService', () => {
  let service: ResumenesAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResumenesAdminService],
    }).compile();

    service = module.get<ResumenesAdminService>(ResumenesAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CronSnapshootService } from './cron-snapshoot.service';

describe('CronSnapshootService', () => {
  let service: CronSnapshootService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CronSnapshootService],
    }).compile();

    service = module.get<CronSnapshootService>(CronSnapshootService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

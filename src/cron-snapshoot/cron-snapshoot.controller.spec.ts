import { Test, TestingModule } from '@nestjs/testing';
import { CronSnapshootController } from './cron-snapshoot.controller';
import { CronSnapshootService } from './cron-snapshoot.service';

describe('CronSnapshootController', () => {
  let controller: CronSnapshootController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronSnapshootController],
      providers: [CronSnapshootService],
    }).compile();

    controller = module.get<CronSnapshootController>(CronSnapshootController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

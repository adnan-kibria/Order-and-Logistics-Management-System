import { Test, TestingModule } from '@nestjs/testing';
import { DeliverymanService } from './deliveryman.service';

describe('DeliverymanService', () => {
  let service: DeliverymanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliverymanService],
    }).compile();

    service = module.get<DeliverymanService>(DeliverymanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

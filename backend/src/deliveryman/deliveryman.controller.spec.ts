import { Test, TestingModule } from '@nestjs/testing';
import { DeliverymanController } from './deliveryman.controller';

describe('DeliverymanController', () => {
  let controller: DeliverymanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliverymanController],
    }).compile();

    controller = module.get<DeliverymanController>(DeliverymanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

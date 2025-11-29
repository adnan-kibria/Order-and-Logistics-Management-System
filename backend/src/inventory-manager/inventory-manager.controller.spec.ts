import { Test, TestingModule } from '@nestjs/testing';
import { InventoryManagerController } from './inventory-manager.controller';

describe('InventoryManagerController', () => {
  let controller: InventoryManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryManagerController],
    }).compile();

    controller = module.get<InventoryManagerController>(InventoryManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

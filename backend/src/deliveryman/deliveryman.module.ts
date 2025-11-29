import { Module } from '@nestjs/common';
import { DeliverymanController } from './deliveryman.controller';
import { DeliverymanService } from './deliveryman.service';

@Module({
  controllers: [DeliverymanController],
  providers: [DeliverymanService]
})
export class DeliverymanModule {}

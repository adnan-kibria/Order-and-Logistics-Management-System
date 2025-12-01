import { Module } from '@nestjs/common';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';

@Module({
  controllers: [DeliverymanController],
  providers: [DeliverymanService],
})
export class DeliverymanModule {}
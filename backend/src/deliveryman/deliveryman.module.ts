import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';
import { Deliveryman } from './entities/deliveryman.entity';

import { Orders } from '../orders/entities/orders.entity'; 
import { OrderStatuses } from '../orders/entities/order-statuses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deliveryman, Orders, OrderStatuses]) 
  ],
  controllers: [DeliverymanController],
  providers: [DeliverymanService],
})
export class DeliverymanModule {}
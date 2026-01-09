import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverymanService } from './deliveryman.service';
import { DeliverymanController } from './deliveryman.controller';
import { DeliveryMen } from 'src/users/entities/deliverymen.entity';

import { Orders } from '../orders/entities/orders.entity'; 
import { OrderStatuses } from '../orders/entities/order-statuses.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryMen, Orders, OrderStatuses]) 
  ],
  controllers: [DeliverymanController],
  providers: [DeliverymanService],
})
export class DeliverymanModule {}
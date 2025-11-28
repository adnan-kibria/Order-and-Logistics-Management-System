/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entities/orders.entity";
import { OrderStatuses } from "./entities/order-statuses.entity";
import { OrderDetails } from "./entities/order-details.entity";

@Module({
    providers: [],
    controllers: [],
    imports: [TypeOrmModule.forFeature([Orders, OrderStatuses, OrderDetails])],
    // exports: [Orders, OrderStatuses, OrderDetails]
})
export class OrderModule { }
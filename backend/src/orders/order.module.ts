/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./entities/orders.entity";
import { OrderStatuses } from "./entities/order-statuses.entity";
import { OrderDetails } from "./entities/order-details.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { Customers } from "src/customers/entities/customers.entity";

@Module({
    providers: [OrderService],
    controllers: [OrderController],
    imports: [TypeOrmModule.forFeature([Orders, OrderStatuses, OrderDetails,Customers])],
    // exports: [Orders, OrderStatuses, OrderDetails]
})
export class OrderModule { }
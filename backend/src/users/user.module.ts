/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./entities/users.entity";
import { DeliveryMen } from "./entities/deliverymen.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { InventoryManager } from "./entities/inventory-manager.entity";
import { Orders } from "src/orders/entities/orders.entity";
import { Customers } from "src/customers/entities/customers.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ Users, DeliveryMen, InventoryManager, Customers, Orders ])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
    
})
export class UserModule { }
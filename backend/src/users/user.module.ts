/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customers } from "./entities/customers.entity";
import { ShippingAddresses } from "./entities/shipping-addresses.entity";
import { Users } from "./entities/users.entity";
import { DeliveryMen } from "./entities/deliverymen.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([Customers, ShippingAddresses, Users, DeliveryMen])],
    controllers: [UserController],
    providers: [UserService]
    // exports: [Customers, Users]
})
export class UserModule { }
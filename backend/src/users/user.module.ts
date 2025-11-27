/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customers } from "./entities/customers.entity";
import { ShippingAddresses } from "./entities/shipping-addresses.entity";
import { Users } from "./entities/users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Customers, ShippingAddresses, Users])]
})
export class UserModule {}
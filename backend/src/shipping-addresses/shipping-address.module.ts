/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { ShippingAddressService } from "./shipping-address.service";
import { ShippingAddressController } from "./shipping-address.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShippingAddresses } from "./entities/shipping-addresses.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ShippingAddresses])],
    controllers: [ShippingAddressController],
    providers: [ShippingAddressService],
    exports: [ShippingAddressService]
})
export class ShippingAddressModule { }
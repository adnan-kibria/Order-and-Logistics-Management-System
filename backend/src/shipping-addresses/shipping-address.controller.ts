/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from "@nestjs/common";
import { ShippingAddresses } from "src/shipping-addresses/entities/shipping-addresses.entity";
import { ShippingAddressService } from "./shipping-address.service";
import { CreateShippingAddress } from "./dto/create-shipping-address.dto";

@Controller('shipping-address')
export class ShippingAddressController {

    constructor(private readonly service: ShippingAddressService) { }

    @Post('create')
    create(@Body() address: CreateShippingAddress): Promise<ShippingAddresses> {
        return this.service.create(address);
    }
}
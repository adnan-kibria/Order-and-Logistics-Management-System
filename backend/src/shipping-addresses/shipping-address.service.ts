/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ShippingAddresses } from "src/shipping-addresses/entities/shipping-addresses.entity";
import { Repository } from "typeorm";
import { CreateShippingAddress } from "./dto/create-shipping-address.dto";

@Injectable()
export class ShippingAddressService {

    constructor(@InjectRepository(ShippingAddresses) private readonly repo: Repository<ShippingAddresses>) { }

    async create(address: CreateShippingAddress): Promise<ShippingAddresses> {
        const sa = this.repo.create(address)
        return await this.repo.save(sa);
    }
}
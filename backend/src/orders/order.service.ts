/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Orders) private readonly orderRepo: Repository<Orders>) { }

    // async placeOrder(obj: any): Promise<Orders> {

    // }
}
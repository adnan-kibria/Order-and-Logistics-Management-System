/* eslint-disable prettier/prettier */

import { Controller, Post } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { OrderService } from "./order.service";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService : OrderService){}
    // @Post('place')
    // placeOrder(@Body()obj : any) : Promise<Orders>{

    // }
}
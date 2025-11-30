/* eslint-disable prettier/prettier */

import { Controller, Param, Patch, Post } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { OrderService } from "./order.service";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService : OrderService){}
    // @Post('place')
    // placeOrder(@Body()obj : any) : Promise<Orders>{

    // }
    //kibria
    @Patch('assign-deliveryman/:orderId/:deliveryManId')
    assignDeliveryMan(
        @Param('orderId') orderId: number,
        @Param('deliveryManId', ) deliveryManId: number
    ): Promise<Orders> {
        return this.orderService.assignDeliveryMan(orderId, deliveryManId);
    }

    //kibria
    @Patch('confirm-order/:orderId')
    confirmOrder(
        @Param('orderId') orderId: number,
    ): Promise<Orders> {
        return this.orderService.confirmOrder(orderId);
    }
    //kibria
    @Patch('cancel-order/:orderId')
    cancelOrder(
        @Param('orderId') orderId: number,
    ): Promise<Orders> {
        return this.orderService.cancelOrder(orderId);
    }
    //kibria
    @Post('total-sales/:filter')
    getTotalSales(
        @Param('filter') filter: string,
    ): Promise<Orders> {
        return this.orderService.getTotalSales(filter);
    }
}
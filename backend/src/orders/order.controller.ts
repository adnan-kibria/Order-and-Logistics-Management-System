/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { OrderService } from "./order.service";
import { Customers } from "src/customers/entities/customers.entity";
import { PlaceOrderDTO } from "./dto/place-order.dto";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    // Munna
    @Post('place')
    placeOrder(@Body() placeOrderDTO: PlaceOrderDTO): Promise<Orders> {
        return this.orderService.placeOrder(placeOrderDTO);
    }

    @Get('track/:cId')
    trackOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.trackOrders(cId);
    }

    @Get('allCancelled/:cId')
    viewCancelledOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.viewCancelledOrders(cId)
    }

    @Get('myOrders/:id')
    ViewAllMyOrders(@Param('id', ParseIntPipe) id: number): Promise<Orders[]> {
        return this.orderService.viewAllMyOrders(id);
    }

    // //kibria
    // @Patch('assign-deliveryman/:orderId/:deliveryManId')
    // assignDeliveryMan(
    //     @Param('orderId') orderId: number,
    //     @Param('deliveryManId',) deliveryManId: number
    // ): Promise<Orders> {
    //     return this.orderService.assignDeliveryMan(orderId, deliveryManId);
    // }

    // //kibria
    // @Patch('confirm-order/:orderId')
    // confirmOrder(
    //     @Param('orderId') orderId: number,
    // ): Promise<Orders> {
    //     return this.orderService.confirmOrder(orderId);
    // }
    // //kibria
    // @Patch('cancel-order/:orderId')
    // cancelOrder(
    //     @Param('orderId') orderId: number,
    // ): Promise<Orders> {
    //     return this.orderService.cancelOrder(orderId);
    // }
    // //kibria
    // @Post('total-sales/:filter')
    // getTotalSales(
    //     @Param('filter') filter: string,
    // ): Promise<Orders> {
    //     return this.orderService.getTotalSales(filter);
    // }
}
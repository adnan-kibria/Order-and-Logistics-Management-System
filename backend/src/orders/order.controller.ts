/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { OrderService } from "./order.service";
import { Customers } from "src/customers/entities/customers.entity";
import { PlaceOrderDTO } from "./dto/place-order.dto";
import { AuthGuard } from "src/auth/auth.guard";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    // Munna
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    @Post('place')
    placeOrder(@Body() placeOrderDTO: PlaceOrderDTO): Promise<Orders> {
        return this.orderService.placeOrder(placeOrderDTO);
    }
    // Munna
    @Get('track/:cId')
    trackOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.trackOrders(cId);
    }
    // Munna
    @Get('allCancelled/:cId')
    viewCancelledOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.viewCancelledOrders(cId)
    }
    // Munna
    @Get('myOrders/:id')
    ViewAllMyOrders(@Param('id', ParseIntPipe) id: number): Promise<Orders[]> {
        return this.orderService.viewAllMyOrders(id);
    }
    // Munna
    @Put('cancelByCustomer/:oId')
    cancelOrderByCustomer(@Param('oId', ParseIntPipe) oId: number): Promise<Orders> {
        return this.orderService.cancelOrderByCustomer(oId);
    }




    //kibria
    @Patch('assign-deliveryman/:orderId/:deliveryManId')
    assignDeliveryMan(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('deliveryManId', ParseIntPipe) deliveryManId: number): Promise<Orders> {
        return this.orderService.assignDeliveryMan(orderId, deliveryManId);
    }

    //kibria
    @Patch('confirm-order/:orderId')
    confirmOrder(@Param('orderId') orderId: number,): Promise<Orders> {
        return this.orderService.confirmOrder(orderId);
    }
    //kibria
    @Patch('cancel-order/:orderId')
    cancelOrder(@Param('orderId') orderId: number): Promise<Orders> {
        return this.orderService.cancelOrder(orderId);
    }

    //kibria
    @Patch('process-order/:orderId')
    processOrder(@Param('orderId') orderId: number): Promise<Orders> {
        return this.orderService.processOrder(orderId);
    }
    //kibria
    @Get('total-sales/:filter')
    getTotalSales(@Param('filter') filter: string,): Promise<{ total: number }> {
        return this.orderService.getTotalSales(filter);
    }
}
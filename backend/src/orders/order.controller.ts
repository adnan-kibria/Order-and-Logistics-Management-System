/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { OrderService } from "./order.service";
// import { Customers } from "src/customers/entities/customers.entity";
import { PlaceOrderDTO } from "./dto/place-order.dto";
import { CustomerGuard } from "src/auth/customer.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { OrderDetails } from "./entities/order-details.entity";
import { Customers } from "src/customers/entities/customers.entity";

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    // Munna
    @UsePipes(new ValidationPipe())
    @UseGuards(CustomerGuard)
    @Post('place')
    placeOrder(@Body() placeOrderDTO: PlaceOrderDTO): Promise<Orders> {
        return this.orderService.placeOrder(placeOrderDTO);
    }
    // Munna
    @UseGuards(CustomerGuard)
    @Get('track/:cId')
    trackOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.trackOrders(cId);
    }
    // Munna
    @UseGuards(CustomerGuard)
    @Get('allCancelled/:cId')
    viewCancelledOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.viewCancelledOrders(cId)
    }
    // Munna
    @UseGuards(CustomerGuard)
    @Get('myOrders/:cId')
    ViewAllMyOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.viewAllMyOrders(cId);
    }

    @Get('customers/:oId')
    getCustomersByOrderId(@Param('oId', ParseIntPipe) oId: number): Promise<Orders[]> {
        return this.orderService.getCustomersByOrderId(oId)
    }

    // Munna
    @UseGuards(CustomerGuard)
    @Put('cancelByCustomer/:oId')
    cancelOrderByCustomer(@Param('oId', ParseIntPipe) oId: number): Promise<Orders> {
        return this.orderService.cancelOrderByCustomer(oId);
    }

    @Get('order-details/:oId')
    orderDetailsByOrderId(@Param('oId', ParseIntPipe) oId: number): Promise<OrderDetails[]> {
        return this.orderService.orderDetailsByOrderId(oId);
    }



    //kibria
    @UseGuards(AdminGuard)
    @Patch('assign-deliveryman/:orderId/:deliveryManId')
    assignDeliveryMan(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('deliveryManId', ParseIntPipe) deliveryManId: number): Promise<Orders> {
        return this.orderService.assignDeliveryMan(orderId, deliveryManId);
    }

    //kibria
    @UseGuards(AdminGuard)
    @Patch('confirm-order/:orderId')
    confirmOrder(@Param('orderId') orderId: number,): Promise<Orders> {
        return this.orderService.confirmOrder(orderId);
    }
    //kibria
    @UseGuards(AdminGuard)
    @Patch('cancel-order/:orderId')
    cancelOrder(@Param('orderId') orderId: number): Promise<Orders> {
        return this.orderService.cancelOrder(orderId);
    }

    //kibria
    @UseGuards(AdminGuard)
    @Patch('process-order/:orderId')
    processOrder(@Param('orderId') orderId: number): Promise<Orders> {
        return this.orderService.processOrder(orderId);
    }
    //kibria
    @UseGuards(AdminGuard)
    @Get('total-sales/:filter')
    getTotalSales(@Param('filter') filter: string,): Promise<{ total: number }> {
        return this.orderService.getTotalSales(filter);
    }
}
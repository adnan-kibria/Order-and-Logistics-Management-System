/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { OrderService } from "./order.service";
import { CustomerGuard } from "src/auth/customer.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { OrderDetails } from "./entities/order-details.entity";
import { PlaceOrderDTO } from "./dto/place-orderV2.dto";


@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @UseGuards(CustomerGuard)
    @Post('place')
    async placeOrder(@Req() req, @Body() placeOrderDTO: PlaceOrderDTO): Promise<Orders> {
        const token: string = req.cookies['jwt'];
        const cId = await this.orderService.user(token);

        return this.orderService.placeOrderV2(placeOrderDTO, cId);
    }

    //kibria
    //kibria
    // @UseGuards(AdminGuard)
    @Get('get-all-orders')
    getAllOrdersWithoutFilter(): Promise<Orders[]> {
        return this.orderService.getAllOrdersWithoutFilter();
    }

    @UseGuards(CustomerGuard)
    @Get('track')
    async trackOrders(@Req() req): Promise<Orders[]> {
        // console.log('Tracking orders for customer ID:', cId);
        const token: string = req.cookies['jwt'];
        const cId = await this.orderService.user(token);
        // console.log('Customer ID from token:', cId);
        console.log('Token in trackOrders:', token);
        return this.orderService.trackOrders(cId);
    }

    @Get(':oId')
    getOrderById(@Param('oId', ParseIntPipe) oId: number): Promise<Orders> {
        return this.orderService.getOrderById(oId);
    }


    // Munna
    @UseGuards(CustomerGuard)
    @Get('allCancelled/:cId')
    viewCancelledOrders(@Param('cId', ParseIntPipe) cId: number): Promise<Orders[]> {
        return this.orderService.viewCancelledOrders(cId)
    }
    // Munna
    // @UseGuards(CustomerGuard)
    @Post('my-orders')
    async ViewAllMyOrders(@Req() req): Promise<Orders[]> {
        const token: string = req.cookies['jwt'];
        console.log('Token in placeOrder:', token);
        // const cId = await this.orderService.user(token);
        return this.orderService.viewAllMyOrders(8); //temporary cId=8
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
    @Post('sendMailToDeliveryMan/:orderId/:mail')
    sendMailToDeliveryMan(@Param('orderId', ParseIntPipe) orderId: number,
        @Param('mail') mail: string): Promise<string> {
        return this.orderService.sendMailToDeliveryMan(orderId, mail);
    }

    //kibria
    @UseGuards(AdminGuard)
    @Patch('confirm-order/:orderId')
    confirmOrder(@Param('orderId') orderId: number,): Promise<Orders> {
        return this.orderService.confirmOrder(orderId);
    }

    //kibria
    @UseGuards(AdminGuard)
    @Post('sendMailToCustomer/:userId/:mail')
    sendMailToCustomer(
        @Param('userId') userId: string,
        @Param('mail') mail: string): Promise<string> {
        return this.orderService.sendMailToCustomer(userId, mail);
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

    //kibria
    @UseGuards(AdminGuard)
    @Get('get-orders/:statusId')
    getAllOrders(@Param('statusId', ParseIntPipe) statusId: number): Promise<Orders[]> {
        return this.orderService.getAllOrders(statusId);
    }

    @UseGuards(AdminGuard)
    @Get('all-deliverymen')
    async getAll() {
        return await this.orderService.findAllDeliveryMen();
    }
}
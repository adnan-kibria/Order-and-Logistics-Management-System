/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customers } from "src/customers/entities/customers.entity";
import { DeliveryMen } from "src/users/entities/deliverymen.entity";
import { OrderStatuses } from "./entities/order-statuses.entity";
import { OrderStatus } from "src/common/enums/order-status.enum";
import { SalesFilter } from "src/common/enums/sales-filter.enum";

@Injectable()
export class OrderService {
    constructor(@InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
                @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
                @InjectRepository(DeliveryMen) private readonly deliverymenRepo: Repository<DeliveryMen>,
                @InjectRepository(OrderStatuses) private readonly orderStatusRepo: Repository<OrderStatuses>) { }

    // async placeOrder(obj: any): Promise<Orders> {
    //     // const {customerId} = obj;
    //     // const customer = this.findCustomer(customerId);
    //     // {

    //     //     "productTotal": 2500.0,
    //     //         "total": 2600.0,
    //     //             "shippingCharge": 100.0,
    //     //                 "customer": {
    //     //         "id": 3,
    //     //             "name": "John Doe",
    //     //                 "phone": "01712345678"
    //     //     },
    //     //     "orderStatus": {
    //     //         "id": 2,
    //     //             "status": "Delivered"
    //     //     },
    //     // }
    // }
    async findCustomer(id: number): Promise<Customers | null> {
        return await this.customerRepo.findOne({
            where: { id },
            relations: ['user', 'shippingAddress'], 
        });
    }

    //kibria
    async assignDeliveryMan(orderId: number, deliveryManId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
        })
        const deliveryman = await this.deliverymenRepo.findOne({
            where: { id: deliveryManId },
        })

        if(!deliveryman) throw new BadRequestException('Deliveryman not found');
        if(!order) throw new BadRequestException('Order not found');

        order.deliveryman = deliveryman;
        order.orderStatus.status = OrderStatus.ASSIGNED;
        return await this.orderRepo.save(order);
    }

    //kibria
    async confirmOrder(orderId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
        })

        if(!order) throw new BadRequestException('Order not found');
        if(order.orderStatus.status !== OrderStatus.CANCELLED) throw new BadRequestException('Order is already cancelled');
        order.orderStatus.status = OrderStatus.CONFIRMED;
        return await this.orderRepo.save(order);
    }

    //kibria
    async cancelOrder(orderId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
        })
        if(!order) throw new BadRequestException('Order not found');
        if(order.orderStatus.status === OrderStatus.DELIVERED) throw new BadRequestException('Delivered order can not be cancelled');
        order.orderStatus.status = OrderStatus.CANCELLED;
        return await this.orderRepo.save(order);
    }

    //kibria
    async getTotalSales(filter:string): Promise<Orders> {
        let date = new Date();
        switch(filter) {
            case SalesFilter.DAILY:
                date.setDate(date.getDate() - 1);
                break;
            case SalesFilter.WEEKLY:
                date.setDate(date.getDate() - 7);
                break;
            case SalesFilter.MONTHLY:
                date.setMonth(date.getMonth() - 1);
                break;
            default:
                throw new BadRequestException('Invalid sales filter');
        }
        const totalSales = await this.orderRepo.createQueryBuilder('orders')
            .select('SUM(order.total)', 'total')
            .where('order.date >= :date', { date: date.toISOString() })
            .andWhere('order.orderStatus = :status', { status: OrderStatus.DELIVERED })
            .getRawOne();

        return totalSales;
    }

}

// {
//   "customerId": 3,
//   "shippingCharge": 100,
//   "products": [
//     {
//       "product": {
//         "id": 1,
//         "name": "Smartphone",
//         "stockQty": 100,
//         "price": 699.99,
//         "discount": 50,
//         "category": {
//           "id": 1,
//           "name": "Electronics"
//         }
//       },
//       "orderPrice": 350
//     },
//     {
//       "product": {
//         "id": 3,
//         "name": "Laptop",
//         "stockQty": 50,
//         "price": 999.99,
//         "discount": 50,
//         "category": {
//           "id": 1,
//           "name": "Electronics"
//         }
//       },
//       "orderPrice": 500
//     }
//   ]
// }
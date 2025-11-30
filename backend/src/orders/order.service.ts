/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Customers } from "src/customers/entities/customers.entity";
import { DeliveryMen } from "src/users/entities/deliverymen.entity";
import { OrderStatuses } from "./entities/order-statuses.entity";
import { SalesFilter } from "src/common/enums/sales-filter.enum";
import { Products } from "src/products/entities/products.entity";
import { OrderItemDTO, PlaceOrderDTO } from "./dto/place-order.dto";
import { OrderDetails } from "./entities/order-details.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(OrderDetails) private readonly orderDetailsRepo: Repository<OrderDetails>,
        @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
        @InjectRepository(DeliveryMen) private readonly deliverymenRepo: Repository<DeliveryMen>,
        @InjectRepository(OrderStatuses) private readonly orderStatusRepo: Repository<OrderStatuses>) { }

    async placeOrder(placeOrderDTO: PlaceOrderDTO): Promise<Orders> {
        const { customerId, orderItems, shippingCharge } = placeOrderDTO;
        const productTotal: number = this.getTotal(orderItems);
        const total: number = productTotal + shippingCharge;
        // console.log(productTotal, total)
        const customer = await this.findCustomer(customerId);
        const orderStatus: OrderStatuses | null = await this.orderStatusRepo.findOne({ where: { id: 1 } })

        if (orderStatus) {
            const placeOrder = {
                productTotal: productTotal,
                total: total,
                shippingCharge: shippingCharge,
                customer: customer,
                orderStatus: orderStatus

            }
            const o = this.orderRepo.create(placeOrder);
            const placedOrder = await this.orderRepo.save(o);
            // let od = []
            for (const oi of orderItems) {
                const od = this.orderDetailsRepo.create({
                    product: oi.product,
                    order: placedOrder,
                    orderPrice: oi.orderPrice,
                    qty: oi.qty
                })
                await this.orderDetailsRepo.save(od);

            }
            return placedOrder;
        }
        throw new Error('Error')

        // {

        //     "productTotal": 2500.0,
        //         "total": 2600.0,
        //             "shippingCharge": 100.0,
        //                 "customer": {
        //         "id": 3,
        //             "name": "John Doe",
        //                 "phone": "01712345678"
        //     },
        //     "orderStatus": {
        //         "id": 2,
        //             "status": "Delivered"
        //     },
        // }
    }

    // Munna
    async findCustomer(id: number): Promise<Customers> {
        const customer = await this.customerRepo.findOne({
            where: { id },
        });
        if (!customer) {
            throw new Error('Customer not Exist');
        }
        return customer;
    }

    // Munna
    getTotal(orderItems: OrderItemDTO[]): number {
        let total: number = 0;
        for (const oi of orderItems) {
            total = total + oi?.orderPrice * oi?.qty
        }
        return total;
    }

    // Munna
    async viewAllMyOrders(id: number): Promise<Orders[]> {
        const customer = await this.findCustomer(id);
        const orders = await this.orderRepo.find({
            where: { customer: customer }
        })
        return orders;

    }

    // Munna
    async trackOrders(cId: number): Promise<Orders[]> {
        const customer = await this.customerRepo.findOneBy({ id: cId })
        if (!customer) throw new Error('error')

        return await this.orderRepo.find({
            where: {
                customer: customer,
                orderStatus: {
                    id: In([1, 2, 3, 5])
                }

            },
            relations: ['orderStatus']
        })
    }

    async viewCancelledOrders(cId: number): Promise<Orders[]> {
        const customer = await this.customerRepo.findOneBy({ id: cId })
        if (!customer) throw new Error('null customer')

        return await this.orderRepo.find({
            where: {
                customer: customer,
                orderStatus: {
                    id: 4
                }
            },
            relations: ['orderStatus']
        });
    }
    // Munna
    // async cancelOrderByCustomer(oId: number): Promise<Orders> {
    //     const existingOrder = await this.orderRepo.findOne({ where: { id: oId } });
    //     existingOrder?.orderStatus = this.orderDetailsRepo.findOne({ where: { id: 4 } })
    // }

    //kibria
    // async assignDeliveryMan(orderId: number, deliveryManId: number): Promise<Orders> {
    //     const order = await this.orderRepo.findOne({
    //         where: { id: orderId },
    //     })
    //     const deliveryman = await this.deliverymenRepo.findOne({
    //         where: { id: deliveryManId },
    //     })

    //     if (!deliveryman) throw new BadRequestException('Deliveryman not found');
    //     if (!order) throw new BadRequestException('Order not found');

    //     order.deliveryman = deliveryman;
    //     order.orderStatus.status = OrderStatus.ASSIGNED;
    //     return await this.orderRepo.save(order);
    // }

    //kibria
    // async confirmOrder(orderId: number): Promise<Orders> {
    //     const order = await this.orderRepo.findOne({
    //         where: { id: orderId },
    //     })

    //     if (!order) throw new BadRequestException('Order not found');
    //     if (order.orderStatus.status !== OrderStatus.CANCELLED) throw new BadRequestException('Order is already cancelled');
    //     order.orderStatus.status = OrderStatus.CONFIRMED;
    //     return await this.orderRepo.save(order);
    // }

    // //kibria
    // async cancelOrder(orderId: number): Promise<Orders> {
    //     //     const order = await this.orderRepo.findOne({
    //     //         where: { id: orderId },
    //     //     })
    //     //     if (!order) throw new BadRequestException('Order not found');
    //     //     if (order.orderStatus.status === OrderStatus.DELIVERED) throw new BadRequestException('Delivered order can not be cancelled');
    //     //     order.orderStatus.status = OrderStatus.CANCELLED;
    //     //     return await this.orderRepo.save(order);
    // }

    // // //kibria
    // async getTotalSales(filter: string): Promise<Orders> {
    //     // let date = new Date();
    //     // switch (filter) {
    //     //     case SalesFilter.DAILY:
    //     //         date.setDate(date.getDate() - 1);
    //     //         break;
    //     //     case SalesFilter.WEEKLY:
    //     //         date.setDate(date.getDate() - 7);
    //     //         break;
    //     //     case SalesFilter.MONTHLY:
    //     //         date.setMonth(date.getMonth() - 1);
    //     //         break;
    //     //     default:
    //     //         throw new BadRequestException('Invalid sales filter');
    //     // }
    //     // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     // const totalSales = await this.orderRepo.createQueryBuilder('orders')
    //     //     .select('SUM(order.total)', 'total')
    //     //     .where('order.date >= :date', { date: date.toISOString() })
    //     //     .andWhere('order.orderStatus = :status', { status: OrderStatus.DELIVERED })
    //     //     .getRawOne();

    //     // return totalSales;
    // }

}


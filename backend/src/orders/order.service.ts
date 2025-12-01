/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
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
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(OrderDetails) private readonly orderDetailsRepo: Repository<OrderDetails>,
        @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
        @InjectRepository(DeliveryMen) private readonly deliverymenRepo: Repository<DeliveryMen>,
        @InjectRepository(OrderStatuses) private readonly orderStatusRepo: Repository<OrderStatuses>,
        private readonly mailerService: MailerService) { }

    async sendEmail(userEmail: string, order: PlaceOrderDTO) {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: `Order Confirmation - Customer #${order.customerId}`,
            template: './order-confirmation', // path to your template file
            html: `<h1>Order Confirmation</h1>
         <p>Customer ID: ${order.customerId}</p>
         <p>Total: ${order.orderItems.reduce((sum, i) => sum + i.orderPrice * i.qty, order.shippingCharge)}</p>`,

            context: {
                customerId: order.customerId,
                shippingCharge: order.shippingCharge,
                orderItems: order.orderItems.map(item => ({
                    productName: item.product.name,   // assuming Products entity has a name field
                    qty: item.qty,
                    price: item.orderPrice,
                })),
                totalAmount: order.orderItems.reduce(
                    (sum, item) => sum + item.orderPrice * item.qty,
                    order.shippingCharge
                ),
            },
        });
    }
    //Munna 
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
            await this.sendEmail("habiburmunna0@gmail.com", placeOrderDTO)
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

    // Munna
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
    async cancelOrderByCustomer(oId: number): Promise<Orders> {
        const existingOrder: Orders | null = await this.orderRepo.findOne({
            where: { id: oId },
            relations: ['orderStatus'],

        })
        if (!existingOrder) throw new Error('no order exist')
        existingOrder.orderStatus.id = 4; // 4 = cancelled by customer
        existingOrder.orderStatus.status = 'Cancelled By Customer'; // 4 = cancelled by customer
        existingOrder.cancelledAt = new Date();
        existingOrder.cancelledBy = 'Customer'

        return await this.orderRepo.save(existingOrder);

    }

    //kibria
    async assignDeliveryMan(orderId: number, deliveryManId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['orderStatus'],
        })

        if (!order) throw new BadRequestException('Order not found');

        const deliveryman = await this.deliverymenRepo.findOne({
            where: { id: deliveryManId },
        })

        if (!deliveryman) throw new BadRequestException('Deliveryman not found');

        order.deliveryman = deliveryman;

        if (order.orderStatus.id === 9 || order.orderStatus.id === 7) {
            throw new BadRequestException('Cannot assign a delivery man to a delivered or cancelled order.');
        }

        const assignedDeliveryMan: OrderStatuses | null = await this.orderStatusRepo.findOne({ where: { id: 8 } });

        if (!assignedDeliveryMan) {
            throw new InternalServerErrorException('Confirmed status (ID 8) not found in DB');
        }

        order.orderStatus = assignedDeliveryMan;

        return await this.orderRepo.save(order);
    }

    //kibria
    async confirmOrder(orderId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['orderStatus']
        })

        if (!order) throw new BadRequestException('Order not found');

        if (order.orderStatus.id === 9 || order.orderStatus.id === 7 || order.orderStatus.id === 8) {
            throw new BadRequestException('Order is already delivered or cancelled or on the way, cannot confirm.');
        }

        const confirmedStatus: OrderStatuses | null = await this.orderStatusRepo.findOne({ where: { id: 6 } });

        if (!confirmedStatus) {
            throw new InternalServerErrorException('Confirmed status (ID 6) not found in DB');
        }

        order.orderStatus = confirmedStatus;

        return await this.orderRepo.save(order);
    }

    //kibria
    async cancelOrder(orderId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['orderStatus']
        })
        if (!order) throw new BadRequestException('Order not found');

        if (order.orderStatus.id === 9) {
            throw new BadRequestException('Delivered order cannot be cancelled.');
        }

        const cancelledStatus: OrderStatuses | null = await this.orderStatusRepo.findOne({ where: { id: 7 } });

        if (!cancelledStatus) {
            throw new InternalServerErrorException('Cancelled status (ID 7) not found in DB');
        }

        order.orderStatus = cancelledStatus;
        order.cancelledBy = 'Admin';
        order.cancelledAt = new Date();

        return await this.orderRepo.save(order);
    }

    //kibria
    async processOrder(orderId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['orderStatus']
        })
        if (!order) throw new BadRequestException('Order not found');

        if (order.orderStatus.id === 9 || order.orderStatus.id === 7 || order.orderStatus.id === 8) {
            throw new BadRequestException('Delivered or cancelled or on the way order cannot be processed.');
        }
        const processingStatus: OrderStatuses | null = await this.orderStatusRepo.findOne({ where: { id: 5 } });

        if (order.orderStatus.id === 4) {
            if (!processingStatus) {
                throw new InternalServerErrorException('Processing status (ID 5) not found in DB');
            } else {
                order.orderStatus = processingStatus;
            }
        }

        return await this.orderRepo.save(order);
    }

    //kibria
    async getTotalSales(filter: string): Promise<{ total: number }> {
        let date = new Date();
        const now = new Date();

        switch (filter.toLowerCase()) {
            case SalesFilter.DAILY.toLowerCase():
                date.setDate(now.getDate() - 1);
                break;
            case SalesFilter.WEEKLY.toLowerCase():
                date.setDate(now.getDate() - 7);
                break;
            case SalesFilter.MONTHLY.toLowerCase():
                date.setMonth(now.getMonth() - 1);
                break;
            default:
                throw new BadRequestException('Invalid sales filter. Use daily, weekly, or monthly.');
        }

        const deliveredStatusId = 9;

        const totalSales = await this.orderRepo.createQueryBuilder('orders')
            .select('SUM(orders.total)', 'total')
            .where('orders.date >= :date', { date: date.toISOString() })
            .andWhere('orders.orderStatusId = :statusId', { statusId: deliveredStatusId })
            .getRawOne() as { total: string };

        return { total: parseFloat(totalSales.total) || 0 };
    }

}


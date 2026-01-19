/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Orders } from "./entities/orders.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Customers } from "src/customers/entities/customers.entity";
import { DeliveryMen } from "src/users/entities/deliverymen.entity";
import { OrderStatuses } from "./entities/order-statuses.entity";
import { SalesFilter } from "src/common/enums/sales-filter.enum";
import { Products } from "src/products/entities/products.entity";
import { OrderDetails } from "./entities/order-details.entity";
import { MailerService } from "@nestjs-modules/mailer";
import { Users } from "src/users/entities/users.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/customer.guard";
import { OrderItemDTO, PlaceOrderDTO } from "./dto/place-orderV2.dto";
import { PusherService } from "src/pusher/pusher.service";


@Injectable()
export class OrderService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(Products) private readonly productRepo: Repository<Products>,
        @InjectRepository(OrderDetails) private readonly orderDetailsRepo: Repository<OrderDetails>,
        @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
        @InjectRepository(DeliveryMen) private readonly deliverymenRepo: Repository<DeliveryMen>,
        @InjectRepository(OrderStatuses) private readonly orderStatusRepo: Repository<OrderStatuses>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        private readonly pusherService: PusherService,
        private readonly mailerService: MailerService) { }

    // async sendEmail(userEmail: string) {
    //     await this.mailerService.sendMail({
    //         to: userEmail,
    //         subject: `Order Confirmation - Customer #}`,
    //         template: './order-confirmation', // path to your template file
    //         html: `<h1>Order Confirmation</h1>
    //      <p>Customer ID: $</p>`,
    //         context: {

    //         },
    //     });
    // }

    async placeOrderV2(placeOrderDTO: PlaceOrderDTO, cId: number): Promise<Orders> {
        const customer: Customers = await this.getCustomerById(cId);
        const orderedFoods: Products[] = await this.getProductById(placeOrderDTO.orderItems);
        const productTotal: number = this.calculateFoodTotal(placeOrderDTO.orderItems, orderedFoods);
        const deliveryCharge: number = 80;

        const orderPlaced = this.orderRepo.create({
            date: new Date(),
            productTotal: productTotal,
            shippingCharge: deliveryCharge,
            total: productTotal + deliveryCharge,
            customer: customer,
            orderStatus: {
                id: 1,
                status: "Placed"
            }
        })

        const orderCreated = await this.orderRepo.save(orderPlaced);
        await this.createOrderDetails(orderCreated, placeOrderDTO.orderItems, orderedFoods);
        return orderCreated;

    }
    async getCustomerById(cId: number): Promise<Customers> {
        const customer: Customers | null = await this.customerRepo.findOneBy({ id: cId });
        if (!customer) {
            throw new NotFoundException('customer not found');
        }
        return customer;
    }
    async getProductById(orderItems: OrderItemDTO[]): Promise<Products[]> {

        const foodIds: number[] = orderItems.map(item => item.productId);

        const products: Products[] = await this.productRepo.find({
            where: {
                id: In(foodIds)
            }
        })
        return products;
    }

    calculateFoodTotal(orderItems: OrderItemDTO[], products: Products[]): number {
        let total = 0;
        for (const oi of orderItems) {

            const f: Products | undefined = products.find(f => f.id === oi.productId);
            if (!f) {
                throw new NotFoundException(`Food with id ${oi.productId} not found`);
            }
            total = total + f.price * oi.qty;
        }
        return total;
    }
    // Order details
    async createOrderDetails(order: Orders, orderItems: OrderItemDTO[], products: Products[]): Promise<OrderDetails[]> {
        const orderDetails: OrderDetails[] = [];
        for (const oi of orderItems) {
            const p: Products | undefined = products.find(p => p.id === oi.productId);
            if (!p) {
                throw new NotFoundException(`Food with id ${oi.productId} not found`);
            }

            const detail = this.orderDetailsRepo.create({
                order,
                orderPrice: p.price,
                qty: oi.qty,
                product: p
            });
            orderDetails.push(detail);
        }
        return await this.orderDetailsRepo.save(orderDetails);
    }

    // Munna
    async user(token: string): Promise<number> {
        // Decode JWT
        const data: JwtPayload = await this.jwtService.verifyAsync(token);

        // Find customer by user ID
        const customer = await this.customerRepo.findOne({
            where: {
                user: { userId: data.sub },
            },
            select: {
                id: true,
            },
        });

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer.id;
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


    //Munna
    async getOrderById(oId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            relations
                : ['customer', 'orderStatus', 'orderDetails', 'orderDetails.product', 'customer.shippingAddress'],
            where: { id: oId },
        });
        if (!order) {
            throw new Error('Order not Exist');
        }
        return order;
    }

    // Munna
    async viewAllMyOrders(id: number): Promise<Orders[]> {
        const customer = await this.findCustomer(id);
        const orders = await this.orderRepo.find({
            where: { customer: customer }
        })
        return orders;

    }

    // 
    async getCustomersByOrderId(oId: number): Promise<Orders[]> {
        return await this.orderRepo.find({
            where: { id: oId },
            relations: ['customer']
        })
    }

    // Munna
    async trackOrders(cId: number): Promise<Orders[]> {
        try {
            const customer = await this.customerRepo.findOneBy({ id: cId })
            if (!customer) throw new NotFoundException('null customer')

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
        catch (error) {
            throw error;
        }
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

    // Munna
    async orderDetailsByOrderId(id: number): Promise<OrderDetails[]> {
        try {
            return this.orderDetailsRepo.find({
                where: { order: { id } },
                relations: ['order', 'product']
            })
        } catch (error) {
            throw error;
        }
    }

    //kibria
    async assignDeliveryMan(orderId: number, deliveryManId: number): Promise<Orders> {
        try {
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
        catch (error) {
            throw error;
        }
    }

    //kibria
    async sendMailToDeliveryMan(orderId: number, mail: string): Promise<string> {
        try {
            const order = await this.orderRepo.findOne({
                where: { id: orderId },
                relations: ['customer', 'customer.shippingAddress', 'orderDetails', 'orderDetails.product', 'deliveryman']
            });

            if (!order) {
                throw new BadRequestException(`Order with ID ${orderId} not found.`);
            }
            if (!order.deliveryman) {
                throw new BadRequestException(`Deliveryman not assigned to order ID ${orderId}.`);
            }
            if (!order.customer.shippingAddress) {
                throw new InternalServerErrorException(`Shipping address not found for customer ID ${order.customer.id}.`);
            }

            const deliverymanEmail = await this.userRepo.findOne({
                where: { email: mail }
            });

            if (!deliverymanEmail) {
                throw new BadRequestException(`Deliveryman email ${mail} not found.`);
            }

            const orderItemsList = order.orderDetails.map(item => ({
                productName: item.product.name,
                qty: item.qty,
                orderPrice: item.orderPrice,
                subtotal: item.orderPrice * item.qty,
            }));

            const shippingAddress = order.customer.shippingAddress;

            await this.mailerService.sendMail({
                to: deliverymanEmail.email,
                subject: `New Order Assignment - Order #${order.id}`,
                template: './delivery-assignment',
                html: `
                <h1>Order Assignment - Order #${order.id}</h1>
                <p>Please deliver the following order:</p>
                
                <h2>Customer Details</h2>
                <p><strong>Name:</strong> ${order.customer.name}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>

                <h2>Shipping Address</h2>
                <p><strong>City:</strong> ${shippingAddress.city}</p>
                <p><strong>Location:</strong> ${shippingAddress.location}</p>
                ${shippingAddress.details ? `<p><strong>Details:</strong> ${shippingAddress.details}</p>` : ''}

                <h2>Order Items</h2>
                <ul>
                    ${orderItemsList.map(item =>
                    `<li>${item.productName} (x${item.qty}) @ ${item.orderPrice} each. Subtotal: ${item.subtotal}</li>`
                ).join('')}
                </ul>
                
                <h2>Order Summary</h2>
                <p>Product Total: ${order.productTotal}</p>
                <p>Shipping Charge: ${order.shippingCharge}</p>
                <p><strong>Grand Total:</strong> ${order.total}</p>
            `,
                context: {
                    orderId: order.id,
                    customerName: order.customer.name,
                    customerPhone: order.customer.phone,
                    shippingCity: shippingAddress.city,
                    shippingLocation: shippingAddress.location,
                    shippingDetails: shippingAddress.details,
                    orderItems: orderItemsList,
                    totalAmount: order.total,
                }
            });
            return `Mail sent to deliveryman successfully`;
        }
        catch (error) {
            throw error;
        }
    }

    //kibria
    async confirmOrder(orderId: number): Promise<Orders> {
        try {
            const order = await this.orderRepo.findOne({
                where: { id: orderId },
                relations: ['orderStatus', 'customer']
            })

            console.log(order)

            if (!order) throw new BadRequestException('Order not found');

            if (order.orderStatus.id === 9 || order.orderStatus.id === 7 || order.orderStatus.id === 8) {
                throw new BadRequestException('Order is already delivered or cancelled or on the way, cannot confirm.');
            }

            const confirmedStatus: OrderStatuses | null = await this.orderStatusRepo.findOne({ where: { id: 6 } });

            if (!confirmedStatus) {
                throw new InternalServerErrorException('Confirmed status (ID 6) not found in DB');
            }

            order.orderStatus = confirmedStatus;
            const savedOrder = await this.orderRepo.save(order);

            await this.pusherService.trigger(
                `order-${order.customer.id}`,   //PUBLIC channel
                'order-status-changed',
                {
                    orderId: order.id,
                    status: 'confirmed',
                    message: `Your order #${order.id} has been confirmed`,
                },
            );


            return savedOrder;

        } catch (error) {
            throw error;
        }
    }

    async sendMailToCustomer(userId: string, mail: string): Promise<string> {
        try {
            const user = await this.userRepo.findOne({
                where: { userId: userId }
            });
            if (!user) {
                throw new BadRequestException(`User with ID ${userId} not found.`);
            }

            const customerEmail = await this.userRepo.findOne({
                where: { email: mail }
            });

            if (!customerEmail) {
                throw new BadRequestException(`Deliveryman email ${mail} not found.`);
            }

            await this.mailerService.sendMail({
                to: customerEmail.email,
                subject: `Order Status`,
                html: `<h1>Order status</h1>
                     <p>Your order is confirmed</p>`,
            });
            return 'Mail sent to customer successfully';
        }
        catch (error) {
            throw error;
        }
    }

    //kibria
    async cancelOrder(orderId: number): Promise<Orders> {
        try {
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
        catch (error) {
            throw error;
        }

    }

    //kibria
    async processOrder(orderId: number): Promise<Orders> {
        try {
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
        catch (error) {
            throw error;
        }
    }

    //kibria
    async getTotalSales(filter: string): Promise<{ total: number }> {
        try {
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
        catch (error) {
            throw error;
        }
    }

    //kibria
    async getAllOrders(statusId: number): Promise<Orders[]> {
        try {
            return await this.orderRepo.find({
                where: { orderStatus: { id: statusId } },
                relations: ['customer', 'orderStatus', 'deliveryman']
            });
        }
        catch (error) {
            throw error;
        }
    }

    //kibria
    async getAllOrdersWithoutFilter(): Promise<Orders[]> {
        try {
            return await this.orderRepo.find({
                relations: ['customer', 'orderStatus', 'deliveryman'],
                order: { date: 'DESC' }
            });
        }
        catch (error) {
            throw error;
        }
    }

    //kibria
    async findAllDeliveryMen(): Promise<DeliveryMen[]> {
        return await this.deliverymenRepo.find({
            relations: ['user'],
            order: { name: 'ASC' }
        });
    }

    //kibria
    async getOrderDetailsById(orderId: number): Promise<Orders> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: [
                'customer',
                'customer.user',
                'customer.shippingAddress',
                'orderStatus',
                'orderDetails',
                'orderDetails.product',
                'deliveryman',
                'deliveryman.user'
            ]
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }

        return order;
    }
}


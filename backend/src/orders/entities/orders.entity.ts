/* eslint-disable prettier/prettier */

import { Customers } from "src/users/entities/customers.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDetails } from "./order-details.entity";
import { OrderStatuses } from "./order-statuses.entity";
import { DeliveryMen } from "src/users/entities/deliverymen.entity";

@Entity('orders')
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @Column({ type: 'float' })
    productTotal: number;

    @Column({ type: 'float' })
    total: number;

    @Column({ type: 'float' })
    shippingCharge: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    cancelledBy: string;

    @Column({ type: 'timestamp', nullable: true })
    cancelledAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt: Date;


    @ManyToOne(() => Customers, customer => customer.orders)
    @JoinColumn({ name: 'customerId' })
    customer: Customers;

    @ManyToOne(() => OrderStatuses, orderStatus => orderStatus.orders)
    @JoinColumn({ name: 'orderStatusId' })
    orderStatus: OrderStatuses;

    @ManyToOne(() => DeliveryMen, deliveryman => deliveryman.order, { nullable: true })
    @JoinColumn({ name: 'deliverymanId' })
    deliveryman: DeliveryMen

    @OneToMany(() => OrderDetails, orderDetails => orderDetails.order)
    orderDetails: OrderDetails[];

}
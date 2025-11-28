/* eslint-disable prettier/prettier */
import { Products } from "src/products/entities/products.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";

@Entity('order-details')
export class OrderDetails {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    qty: number;

    @Column({ type: 'float' })
    orderPrice: number;

    @ManyToOne(() => Products, products => products.orderDetails)
    @JoinColumn({ name: 'productId' })
    product: Products;

    @ManyToOne(() => Orders, orders => orders.orderDetails)
    @JoinColumn({ name: 'orderId' })
    order: Orders;

}

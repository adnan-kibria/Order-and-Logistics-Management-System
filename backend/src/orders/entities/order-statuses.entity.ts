/* eslint-disable prettier/prettier */

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./orders.entity";

@Entity('order-statuses')
export class OrderStatuses {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    status: string;

    @OneToMany(() => Orders, orders => orders.orderStatus)
    orders: Orders[];
    // static status: number;

}
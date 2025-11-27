/* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customers } from "./customers.entity";

@Entity('shipping_addresses')
export class ShippingAddresses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20 })
    city: string;

    @Column({ type: 'varchar', length: 40 })
    location: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    details: string;

    @OneToOne(() => Customers, customer => customer.shippingAddress)
    customer: Customers;
}
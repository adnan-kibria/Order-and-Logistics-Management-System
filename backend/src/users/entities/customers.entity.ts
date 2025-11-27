/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";
import { ShippingAddresses } from "./shipping-addresses.entity";

@Entity('customers')
export class Customers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, type: 'varchar' })
    name: string;

    @Column({ length: 11, type: 'varchar' })
    phone: string;

    @OneToOne(() => Users, user => user.customer)
    @JoinColumn({ name: 'userId' })
    user: Users;

    @OneToOne(() => ShippingAddresses, shippingAddress => shippingAddress.customer)
    @JoinColumn({ name: 'shippingAddressId' })
    shippingAddress: ShippingAddresses;
}
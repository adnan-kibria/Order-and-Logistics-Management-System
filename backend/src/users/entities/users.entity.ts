/* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customers } from "./customers.entity";
import { DeliveryMen } from "./deliverymen.entity";

// export enum UserRole {
//     CUSTOMER = 'customer',
//     DELIVERYMAN = 'deliveryman',
//     ADMIN = 'admin'
// }


@Entity('users')
export class Users {
    @PrimaryGeneratedColumn('uuid')
    userId: string;   // UUID primary key

    @Column()
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    // @Column({ type: "enum", enum: UserRole })
    // role: UserRole;

    @Column({ type: "varchar", length: 15 })
    role: string;

    @OneToOne(() => Customers, customer => customer.user)
    customer: Customers;

    @OneToOne(() => DeliveryMen, deliveryman => deliveryman.user)
    deliveryman: DeliveryMen
}
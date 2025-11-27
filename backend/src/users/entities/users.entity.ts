/* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customers } from "./customers.entity";

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn('uuid')
    userId: string;   // UUID primary key

    @Column()
    email: string;

    @Column({ type: "varchar", length: 20 })
    password: string;

    @Column({ type: "varchar", length: 15 })
    role: string;

    @OneToOne(() => Customers, customer => customer.user)
    customer: Customers;
}
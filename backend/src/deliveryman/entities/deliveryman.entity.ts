/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../../users/entities/users.entity";
import { Orders } from "../../orders/entities/orders.entity"; // Adjust path as needed

@Entity('deliverymen')
export class Deliverymen {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, type: 'varchar' })
    name: string;

    @Column({ length: 11, type: 'varchar' })
    phone: string;

    @OneToOne(() => Users, user => user.deliveryman)
    @JoinColumn({ name: 'userId' })
    user: Users;

    @OneToMany(() => Orders, orders => orders.deliveryman)
    orders: Orders[];
}
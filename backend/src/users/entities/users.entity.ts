/* eslint-disable prettier/prettier */
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Customers } from "../../customers/entities/customers.entity";
import { DeliveryMen } from "./deliverymen.entity";
import { InventoryManager } from "./inventory-manager.entity";


@Entity('users')
@Unique(['email'])
export class Users {
    @PrimaryGeneratedColumn('uuid')
    userId: string; 

    @Column()
    email: string;

    @Column({ type: "varchar", length: 255 })
    password: string;

    @Column({ type: "varchar", length: 20 })
    role: string;

    @OneToOne(() => Customers, customer => customer.user)
    customer: Customers;

    @OneToOne(() => DeliveryMen, deliveryman => deliveryman.user)
    deliveryman: DeliveryMen

    @OneToOne(() => InventoryManager, inventorymanager => inventorymanager.user)
    inventorymanager: InventoryManager
}
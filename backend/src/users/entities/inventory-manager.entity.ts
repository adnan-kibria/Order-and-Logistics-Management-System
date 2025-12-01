/* eslint-disable prettier/prettier */
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity('inventory-manager')
export class InventoryManager {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, type: 'varchar' })
    name: string;

    @Column({ length: 11, type: 'varchar' })
    phone: string;

    @OneToOne(() => Users, user => user.inventorymanager)
    @JoinColumn({ name: 'userId' })
    user: Users;
}
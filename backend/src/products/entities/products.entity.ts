/* eslint-disable prettier/prettier */

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categories } from "./categories.entity";

@Entity('products')
export class Products {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'float' })
    stockQty: number;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'float' })
    discount: number;

    @ManyToOne(() => Categories, category => category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Categories;

}
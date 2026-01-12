/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Products } from "./entities/products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { CheckoutCartProductsDto } from "./dto/cart-products.dto";

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Products) private repo: Repository<Products>) { }

    async searchProduct(name: string): Promise<Products[]> {
        return await this.repo.find({
            where: {
                name: Like(`%${name}%`)
            }
        })
    }
    async getAll(): Promise<Products[]> {
        return await this.repo.find();
    }
    
    async getCartProducts(cartProducts: CheckoutCartProductsDto[]): Promise<Products[]> {
        const productIds: number[] = cartProducts.map(item => Number(item.productId));

        return await this.repo.find({
            where: { id: In(productIds) }
        });
    }

}
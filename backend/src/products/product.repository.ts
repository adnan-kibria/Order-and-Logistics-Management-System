/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Products } from "./entities/products.entity";
import { Repository } from "typeorm";
import { CreateProduct } from "./dto/create-product.dto";

@Injectable()
export class ProductRepository {
    constructor(@InjectRepository(Products) private repo: Repository<Products>) { }

    async addProduct(product: CreateProduct): Promise<Products> {
        try {
            const p = this.repo.create(product);
            return await this.repo.save(p);
        }
        catch (ex) {
            throw new Error("something is wrong");
        }
    }
}
/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { CreateProduct } from "./dto/create-product.dto";
import { ProductRepository } from "./product.repository";
import { Products } from "./entities/products.entity";

@Injectable()
export class ProductService {
    constructor(private readonly productRepo: ProductRepository) { }
    async addProduct(product: CreateProduct): Promise<Products> {
        return await this.productRepo.addProduct(product);
    }
}
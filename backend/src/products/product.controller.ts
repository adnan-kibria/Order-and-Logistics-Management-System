/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from "@nestjs/common";
import { CreateProduct } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { Products } from "./entities/products.entity";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Post('add')
    async addProduct(product: CreateProduct): Promise<Products> {
        return await this.productService.addProduct(product);
    }
}
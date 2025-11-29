/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Query } from "@nestjs/common";
// import { CreateProduct } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { Products } from "./entities/products.entity";
// import { Products } from "./entities/products.entity";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get('search/:name')
    search(@Param('name') name: string): Promise<Products[]> {
        return this.productService.searchProduct(name);
    }
}
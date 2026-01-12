/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
// import { CreateProduct } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { Products } from "./entities/products.entity";
import { CheckoutCartProductsDto } from "./dto/cart-products.dto";
// import { Products } from "./entities/products.entity";

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }
    @Get('search/:name')
    search(@Param('name') name: string): Promise<Products[]> {
        return this.productService.searchProduct(name);
    }

    @Get('all')
    getAll(): Promise<Products[]> {
        return this.productService.getAll();
    }

    @Post('cart-products')
    getCartProducts(@Body() cartProducts: CheckoutCartProductsDto[]): Promise<Products[]> {
        return this.productService.getCartProducts(cartProducts);
    }
}
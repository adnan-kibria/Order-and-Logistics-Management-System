/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
// import { CreateProduct } from "./dto/create-product.dto";
import { ProductService } from "./product.service";
import { Products } from "./entities/products.entity";
import { CheckoutCartProductsDto } from "./dto/cart-products.dto";
import { CreateProduct } from "./dto/create-product.dto";
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
    
    //shad
    @Post('create-product')
    create(@Body() data: CreateProduct): Promise<Products> {
        return this.productService.createProduct(data);
    }

    // @UseGuards(InventoryManagerGuard)
    @Patch('update-product/:id')
    update(@Param('id') id: number, @Body() data: Partial<CreateProduct>): Promise<Products> {
        return this.productService.updateProduct(id, data);
    }

    // @UseGuards(InventoryManagerGuard)
    @Delete('delete-product/:id')
    delete(@Param('id') id: number): Promise<void> {
        return this.productService.deleteProduct(id);
    }

    @Get('all-products')
    getAllProducts(): Promise<Products[]> {
        return this.productService.getAllProducts();
    }

    // @UseGuards(InventoryManagerGuard)
    @Get(':id')
    getById(@Param('id') id: number): Promise<Products> {
        return this.productService.getProductById(id);
    }
}
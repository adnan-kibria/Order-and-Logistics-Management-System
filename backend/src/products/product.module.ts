/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "./entities/products.entity";
import { Categories } from "./entities/categories.entity";
import { ProductService } from "./product.service";
import { ProductRepository } from "./product.repository";
import { ProductController } from "./product.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Products, Categories])],
    providers: [ProductService, ProductRepository],
    controllers: [ProductController],
    // exports: [Products]
})
export class ProductModule { }
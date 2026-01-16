/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from "@nestjs/common";
import { Products } from "./entities/products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { CheckoutCartProductsDto } from "./dto/cart-products.dto";
import { CreateProduct } from "./dto/create-product.dto";
import { Categories } from "./entities/categories.entity";

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Products) private repo: Repository<Products>,
    @InjectRepository(Categories) private categoryRepo: Repository<Categories>) { }

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

    async createProduct(data: CreateProduct): Promise<Products> {
        const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
        if (!category) throw new NotFoundException('Category not found');

        const product = this.repo.create({
            name: data.name,
            stockQty: data.stockQty,
            price: data.price,
            discount: data.discount,
            category,
        });

        return this.repo.save(product);
    }

    // Edit/Update a product
    async updateProduct(id: number, data: Partial<CreateProduct>): Promise<Products> {
        const product = await this.repo.findOne({ where: { id }, relations: ['category'] });
        if (!product) throw new NotFoundException('Product not found');

        if (data.categoryId) {
            const category = await this.categoryRepo.findOne({ where: { id: data.categoryId } });
            if (!category) throw new NotFoundException('Category not found');
            product.category = category;
        }

        Object.assign(product, data); // Update other fields
        return this.repo.save(product);
    }

    // Delete a product
    async deleteProduct(id: number): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Product not found');
    }

    // Optional: Get all products
    async getAllProducts(): Promise<Products[]> {
        return this.repo.find({ relations: ['category'] });
    }

    // Optional: Get product by ID
    async getProductById(id: number): Promise<Products> {
        const product = await this.repo.findOne({ where: { id }, relations: ['category'] });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

}
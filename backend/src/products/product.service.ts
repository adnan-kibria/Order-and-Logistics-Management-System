/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Products } from "./entities/products.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

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
}
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/products/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Categories) private categoryRepository: Repository<Categories>) { }

    getAllCategories(): Promise<Categories[]> {
        return this.categoryRepository.find();
    }
}

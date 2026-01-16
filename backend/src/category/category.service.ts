/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/products/entities/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Categories) private categoryRepository: Repository<Categories>) { }

    getAllCategories(): Promise<Categories[]> {
        return this.categoryRepository.find();
    }

    getCategoryById(id: number) {
      throw new Error('Method not implemented.');
    }
    searchCategory(name: string) {
        throw new Error('Method not implemented.');
    }  

    async createCategory(dto: CreateCategoryDto) {
        const category = this.categoryRepository.create(dto);
        return this.categoryRepository.save(category);
    }

    async getCategoryByIdp(id: number): Promise<Categories> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
        throw new NotFoundException('Category not found');
    }
    return category;
    }
}

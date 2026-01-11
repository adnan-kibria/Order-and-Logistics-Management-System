/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Categories } from 'src/products/entities/categories.entity';

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get('all')
    async getAllCategories() : Promise<Categories[]> {
        return this.categoryService.getAllCategories();
    }
}

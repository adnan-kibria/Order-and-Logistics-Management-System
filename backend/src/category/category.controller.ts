/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Categories } from 'src/products/entities/categories.entity';
import { CreateCategoryDto } from './dto/category.dto';
import { InventoryManagerGuard } from 'src/auth/inventory-manager.guard';

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    // @UseGuards(InventoryManagerGuard)
    @Get('all')
    async getAllCategories() : Promise<Categories[]> {
        return this.categoryService.getAllCategories();
    }

    @Post('create-category')
    async create(@Body() body: CreateCategoryDto) {
        return this.categoryService.createCategory(body);
    }

    @Get(':id')
    async findById(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
    }

}

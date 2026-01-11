/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Categories } from 'src/products/entities/categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [TypeOrmModule.forFeature([Categories])],
})
export class CategoryModule {}

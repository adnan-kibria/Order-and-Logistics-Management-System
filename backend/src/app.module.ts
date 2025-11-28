/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5850',
      database: 'e-commerce-web-app',
      autoLoadEntities: true,
      synchronize: true
    })],
})
export class AppModule { }

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { ShippingAddressModule } from './shipping-addresses/shipping-address.module';

@Module({
  imports: [UserModule, ProductModule, OrderModule, CustomersModule, ShippingAddressModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5850',
      database: 'e-commerce-web-app',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { ShippingAddressModule } from './shipping-addresses/shipping-address.module';
import { DeliverymanModule } from './deliveryman/deliveryman.module';
import { InventoryManagerModule } from './inventory-manager/inventory-manager.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, ProductModule, OrderModule, CustomersModule, ShippingAddressModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 7000,
      username: 'postgres',
      password: 'admin',
      database: 'e-commerce-web-app',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    DeliverymanModule,
    InventoryManagerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

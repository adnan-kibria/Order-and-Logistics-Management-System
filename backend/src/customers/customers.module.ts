/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entities/customers.entity';
import { ShippingAddresses } from 'src/shipping-addresses/entities/shipping-addresses.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customers, Users, ShippingAddresses])],
    providers: [CustomersService],
    controllers: [CustomersController]
})
export class CustomersModule { }

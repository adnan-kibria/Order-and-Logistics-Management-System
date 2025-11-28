/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
// import { CustomersRepository } from './customers.repository';

@Module({
    providers: [CustomersService],
    controllers: [CustomersController]
})
export class CustomersModule { }

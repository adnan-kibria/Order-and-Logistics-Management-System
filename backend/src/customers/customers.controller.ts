/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomer } from './dto/create-customer.dto';
import { Customers } from './entities/customers.entity';
import { emit } from 'process';
import { IsEmail } from 'class-validator';
import { ChangeEmailDTO } from './dto/chnage-email.dto';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomersService) { }

    // Munna
    @Post('register')
    register(@Body() customer: CreateCustomer): Promise<Customers> {
        return this.customerService.register(customer)
    }

    @Get('viewProfile/:id')
    viewProfile(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.customerService.viewProfile(id);
    }

    @Patch('changeEmail')
    async changeEmail(@Body() changeEmailDTO: ChangeEmailDTO): Promise<string> {
        console.log(changeEmailDTO.customerId, changeEmailDTO.email)
        return this.customerService.changeEmail(changeEmailDTO.customerId, changeEmailDTO.email);
    }
}

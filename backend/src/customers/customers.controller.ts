/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomer } from './dto/create-customer.dto';
import { Customers } from './entities/customers.entity';
import { ChangeEmailDTO } from './dto/change-email.dto';
import { CustomerGuard } from 'src/auth/customer.guard';

@Controller('customers')

export class CustomersController {
    constructor(private readonly customerService: CustomersService) { }

    // Munna
    @UsePipes(new ValidationPipe())
    @Post('register')
    register(@Body() customer: CreateCustomer): Promise<Customers> {
        return this.customerService.register(customer)
    }

    // Munna
    @UseGuards(CustomerGuard)
    @Get('viewProfile/:id')
    viewProfile(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.customerService.viewProfile(id);
    }

    // Munna
    @UseGuards(CustomerGuard)
    @Patch('changeEmail')
    async changeEmail(@Body() changeEmailDTO: ChangeEmailDTO): Promise<string> {
        console.log(changeEmailDTO.customerId, changeEmailDTO.email)
        return this.customerService.changeEmail(changeEmailDTO.customerId, changeEmailDTO.email);
    }
}

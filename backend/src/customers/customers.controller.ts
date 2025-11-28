/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customerService: CustomersService){}

    @Post('register')
    register(@Body() obj): any {
        return this.customerService.register(obj)
    }
}

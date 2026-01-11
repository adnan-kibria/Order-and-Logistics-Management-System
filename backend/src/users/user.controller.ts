/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';
import { CreateUser } from './dto/create-user.dto';
import { CreateDeliverymanDto } from 'src/deliveryman/dto/create-deliveryman.dto';
import { CreateInventoryManagerDto } from 'src/inventory-manager/dto/create-inventory-manager.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { CreateAdmin } from './dto/create-admin.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AdminGuard)
    @Post('create')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createUser(
        @Body() user: CreateUser,
        @Body() deliveryMan: CreateDeliverymanDto,
        @Body() inventoryManager: CreateInventoryManagerDto
    ): Promise<Users> {
        return this.userService.createUser(user, deliveryMan, inventoryManager);
    }

    @Get()
    async getAllUsers(): Promise<Users[]> {
        return this.userService.findAll();
    }

    @Get('allCustomerDetails')
    async allCustomerDetails(): Promise<Users[]> {
        return this.userService.allCustomerDetails();
    }

    //kibria
    @UseGuards(AdminGuard)
    @Get('with-relations')
    async getAllUsersWithRelations(): Promise<any[]> {
        return this.userService.findAllWithRelations();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<Users | null> {
        return this.userService.findById(id);
    }

    //kibria
    @UseGuards(AdminGuard)
    @Delete('delete-user/:email')
    async deleteUser(@Param('email') email: string): Promise<{ message: string }> {
        return this.userService.deleteUser(email);
    }

    //kibria
    @UseGuards(AdminGuard)
    @Get('admin/:userId')
    async viewUserProfile(@Param('user_id') user_id: string): Promise<any> {
        return this.userService.getProfileByAdmin(user_id);
    }

    @Post('create-admin')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createAdmin(
        @Body() user: CreateAdmin,
    ): Promise<Users> {
        return this.userService.createAdmin(user);
    }
}
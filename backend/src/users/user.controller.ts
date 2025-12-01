/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';
import { CreateUser } from './dto/create-user.dto';
import { CreateDeliverymanDto } from 'src/deliveryman/dto/create-deliveryman.dto';
import { CreateInventoryManagerDto } from 'src/inventory-manager/dto/create-inventory-manager.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    async createUser(
        @Body() user: CreateUser,
        @Body() deliveryMan : CreateDeliverymanDto,
        @Body() inventoryManager : CreateInventoryManagerDto    
    ): Promise<Users> {
        return this.userService.createUser(user, deliveryMan, inventoryManager);
    }

    @Get()
    async getAllUsers(): Promise<Users[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<Users | null> {
        return this.userService.findById(id);
    }

    //kibria
    @Delete('delete-user/:email')
    async deleteUser(@Param('email') email: string): Promise<{message: string}> {
        return this.userService.deleteUser(email);
    }

    @Get('admin/:userId')
    async viewUserProfile(@Param('user_id') user_id: string): Promise<any> {
        return this.userService.getProfileByAdmin(user_id);
    }
}
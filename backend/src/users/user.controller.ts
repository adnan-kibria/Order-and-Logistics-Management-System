/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';
import { CreateUser } from './dto/create-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    async createUser(
        @Body() user: CreateUser
    ): Promise<Users> {
        return this.userService.createUser(user);
    }

    @Get()
    async getAllUsers(): Promise<Users[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<Users | null> {
        return this.userService.findById(id);
    }
}
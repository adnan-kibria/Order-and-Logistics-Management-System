/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './entities/users.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('create')
    async createUser(
        @Body() user: any
    ): Promise<Users> {
        return this.userService.createUser(user.email, user.password, user.role);
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
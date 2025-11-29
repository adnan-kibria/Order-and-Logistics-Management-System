/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) { }

    async createUser(user: CreateUser): Promise<Users> {
        const u = this.userRepository.create(user);
        return await this.userRepository.save(u);
    }

    async findAll(): Promise<Users[]> {
        return await this.userRepository.find();
    }

    async findById(id: string): Promise<Users | null> {
        return await this.userRepository.findOne({ where: { userId: id } });
    }

    async findOne(email): Promise<Users | null> {
        return await this.userRepository.findOne({ where: email })
    }
}
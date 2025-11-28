/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
    ) { }

    async createUser(email: string, password: string, role: string): Promise<Users> {
        const user = this.userRepository.create({ email, password, role });
        return await this.userRepository.save(user);
    }

    async findAll(): Promise<Users[]> {
        return await this.userRepository.find();
    }

    async findById(id: string): Promise<Users | null> {
        return await this.userRepository.findOne({ where: { userId: id } });
    }
}
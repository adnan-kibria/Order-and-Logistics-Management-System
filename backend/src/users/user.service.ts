/* eslint-disable prettier/prettier */
import { BadRequestException, Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { In, Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateDeliverymanDto } from 'src/deliveryman/dto/create-deliveryman.dto';
import { CreateInventoryManagerDto } from 'src/inventory-manager/dto/create-inventory-manager.dto';
import { DeliverymanInterface } from 'src/deliveryman/interface/deliveryman.interface';
import { DeliveryMen } from './entities/deliverymen.entity';
import { InventoryManager } from './entities/inventory-manager.entity';
import { InventoryManagerInterface } from 'src/inventory-manager/interface/inventory-manager.interface';
import { del } from 'superagent';
import { Customers } from 'src/customers/entities/customers.entity';
import { Orders } from 'src/orders/entities/orders.entity';

const USER_ROLES = {
    CUSTOMER: 'customer',
    DELIVERYMAN: 'deliveryman',
    INVENTORYMANAGER: 'inventorymanager',
    ADMIN: 'admin',
};

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        @InjectRepository(DeliveryMen) private readonly deliveryManRepository: Repository<DeliveryMen>,
        @InjectRepository(InventoryManager) private readonly inventoryManagerRepository: Repository<InventoryManager>,
        @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
        @InjectRepository(Orders) private readonly orderRepository: Repository<Orders>,
    ) { }

    //kibria
    async createUser(user: CreateUser, deliveryMan: CreateDeliverymanDto, inventoryManager: CreateInventoryManagerDto): Promise<Users> {
        const exist = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        });
        if (exist) throw new BadRequestException('Email already exists');

        const saltRounds = 6;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const u = this.userRepository.create({
            email: user.email,
            password: hashedPassword,
            role: user.role
        });
        const saveUser = await this.userRepository.save(u);

        if (user.role === 'deliveryman') {
            const dm: DeliverymanInterface = {
                name: deliveryMan.name,
                phone: deliveryMan.phone,
                user: saveUser
            }
            const addDeliveryMan = this.deliveryManRepository.create(dm);
            await this.deliveryManRepository.save(addDeliveryMan);
        }
        else {
            const inv: InventoryManagerInterface = {
                name: inventoryManager.name,
                phone: inventoryManager.phone,
                user: saveUser
            }
            const addInventoryManager = this.inventoryManagerRepository.create(inv);
            await this.inventoryManagerRepository.save(addInventoryManager);
        }
        return saveUser;
    }

    async findAll(): Promise<Users[]> {
        return await this.userRepository.find();
    }

    async findById(id: string): Promise<Users | null> {
        return await this.userRepository.findOne({ where: { userId: id } });
    }

    async findOne(userEmail: string): Promise<Users | null> {
        return await this.userRepository.findOne({
            where: {
                email: userEmail
            }
        })
    }

    //kibria
    async deleteUser(email: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['deliveryman', 'inventorymanager']
        });
        if (!user) throw new BadRequestException('User not found');

        if (user.deliveryman) {
            await this.deliveryManRepository.remove(user.deliveryman);
        }
        else {
            await this.inventoryManagerRepository.remove(user.inventorymanager);
        }
        await this.userRepository.remove(user);
        return { message: 'User deleted successfully' };
    }

    async getProfileByAdmin(userId: string): Promise<any> {
        const baseUser = await this.userRepository.findOne({
            where: { userId },
            select: ['userId', 'email', 'role'],
        });

        if (!baseUser) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        let roleSpecificData: any = {};

        switch (baseUser.role) {
            case USER_ROLES.CUSTOMER:
                roleSpecificData = await this.customerRepo.findOne({
                    where: { user: { userId: baseUser.userId } },
                    relations: ['shippingAddress'],
                });

                if (roleSpecificData) {
                    const orderCount = await this.orderRepository.count({
                        where: { customer: { id: roleSpecificData.id } },
                    });
                    roleSpecificData.totalOrders = orderCount;
                }

                break;

            case USER_ROLES.DELIVERYMAN:
                roleSpecificData = await this.deliveryManRepository.findOne({
                    where: { user: { userId: baseUser.userId } },
                    relations: ['order'],
                });

                if (roleSpecificData) {
                    const completedDeliveries = await this.orderRepository.count({
                        where: { deliveryman: { id: roleSpecificData.id }, deliveredAt: new Date() },
                    });
                    roleSpecificData.deliveriesCompleted = completedDeliveries;
                    delete roleSpecificData.order;
                }
                break;

            case USER_ROLES.INVENTORYMANAGER:
                roleSpecificData = await this.inventoryManagerRepository.findOne({
                    where: { user: { userId: baseUser.userId } },
                });

                break;

            default:
                roleSpecificData = { details: `Base user role: ${baseUser.role}` };
                break;
        }

        return {
            ...baseUser,
            profile: roleSpecificData || null,
        };
    }

    // @Get('allCustomerDetails')
    async allCustomerDetails(): Promise<Users[]> {
        return await this.userRepository.find({
            where: { role: 'customer' },
            relations: ['customer']
        })
    }
}
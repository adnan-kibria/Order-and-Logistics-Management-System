/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from 'src/customers/entities/customers.entity';
import { Repository } from 'typeorm';
import { CreateCustomer } from './dto/create-customer.dto';
import { CreateUser } from 'src/users/dto/create-user.dto';
import { CustomerInterface } from './interface/create-customer.interface';
import { Users } from 'src/users/entities/users.entity';
import { ShippingAddresses } from 'src/shipping-addresses/entities/shipping-addresses.entity';

@Injectable()
export class CustomersService {
    constructor(@InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>, @InjectRepository(ShippingAddresses) private readonly shippingAddressRepo: Repository<ShippingAddresses>) { }

    // Munna
    async register(customer: CreateCustomer): Promise<Customers> {
        const { address } = customer;
        const { email, password, name, phone } = customer;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)
        const user: CreateUser = {
            email: email,
            password: hashedPassword,
            role: 'customer'
        }
        const u = this.userRepo.create(user);
        const sa = this.shippingAddressRepo.create(address);
        const userCreated = await this.userRepo.save(u);
        const addressCreated = await this.shippingAddressRepo.save(sa);


        const c: CustomerInterface = {
            name: name,
            phone: phone,
            user: userCreated,
            shippingAddress: addressCreated
        }
        const newCustomer = this.customerRepo.create(c)
        return await this.customerRepo.save(newCustomer);

    }
    // Munna
    async viewProfile(id: number): Promise<Customers | null> {
        return await this.customerRepo
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.user', 'user')
            .leftJoinAndSelect('customer.shippingAddress', 'shippingAddress')
            .where('customer.id = :id', { id })
            .select([
                'customer.id',
                'customer.name',
                'customer.phone',
                'user.userId',
                'user.email',
                'user.role',
                'shippingAddress.id',
                'shippingAddress.city',
                'shippingAddress.location',
                'shippingAddress.details',
            ])
            .getOne();


    }

    // Munna

    async changeEmail(cId: number, newEmail: string): Promise<string> {
        const customer = await this.customerRepo.findOne(
            {
                where: { id: cId },
                relations: ['user'],
            }
        );
        if (!customer) throw new Error('null customer')
        customer.user.email = newEmail;
        await this.userRepo.save(customer.user);

        return `email has changed to : ${customer.user.email}`;
    }
}

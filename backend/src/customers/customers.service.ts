/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt'
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from 'src/customers/entities/customers.entity';
import { Repository } from 'typeorm';
import { CreateCustomer } from './dto/create-customer.dto';
import { CreateUser } from 'src/users/dto/create-user.dto';
import { CustomerInterface } from './interface/create-customer.interface';
import { Users } from 'src/users/entities/users.entity';
import { ShippingAddresses } from 'src/shipping-addresses/entities/shipping-addresses.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customers) private readonly customerRepo: Repository<Customers>,
        @InjectRepository(Users) private readonly userRepo: Repository<Users>,
        @InjectRepository(ShippingAddresses) private readonly shippingAddressRepo: Repository<ShippingAddresses>,
        private readonly mailerService: MailerService) { }

    async sendEmail(userEmail: string, userId: string) {
        try {
            await this.mailerService.sendMail({
                to: userEmail,
                subject: 'Welcome to our app!',
                template: './welcome', // path to template file
                context: {             // variables for template
                    userId: userId,
                },
            });
        }
        catch (error) {
            throw error;
        }
    }

    // Munna
    async register(customer: CreateCustomer): Promise<Customers> {
        try {
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
            const createdCustomer = await this.customerRepo.save(newCustomer);
            // await this.sendEmail(email, userCreated.userId);
            return createdCustomer;

        } catch (error) {
            if (error?.code === '23505') {
                // Postgres unique violation
                throw new ConflictException('Email already exists');
            }
            throw error;
        }

    }
    // Munna
    async viewProfile(id: number): Promise<Customers | null> {
        try {
            return await this.customerRepo.findOne({
                where: { id },
                relations: ['user', 'shippingAddress'],
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    user: {
                        userId: true,
                        email: true,
                        role: true,
                    },
                    shippingAddress: {
                        id: true,
                        city: true,
                        location: true,
                        details: true,
                    },
                },
            });

        }
        catch (error) {
            throw error;
        }

    }

    // Munna

    async changeEmail(cId: number, newEmail: string): Promise<string> {
        try {
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
        } catch (error) {
            if (error.code === '501') {
                throw new InternalServerErrorException();
            }
            throw error
        }

    }
}

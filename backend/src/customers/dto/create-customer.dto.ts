/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword, ValidateNested } from "class-validator";
import { CreateShippingAddress } from "src/shipping-addresses/dto/create-shipping-address.dto";

export class CreateCustomer {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 8
    })
    password: string;

    @IsPhoneNumber('BD')
    phone: string;

    @ValidateNested()
    @Type(() => CreateShippingAddress)
    address: CreateShippingAddress;

}

// {
//     "email": "customer@example.com",
//         "phone": "01712345678",
//             "password": "Customer@123",
//                 "name": "John Doe",
//                     "address": {
//         "city": "Dhaka",
//             "location": "Dhanmondi 27",
//                 "details": "Flat B3, Road 12"
//     }
// }
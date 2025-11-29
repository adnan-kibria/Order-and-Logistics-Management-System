/* eslint-disable prettier/prettier */
import { CreateShippingAddress } from "src/shipping-addresses/dto/create-shipping-address.dto";

export class CreateCustomer {
    name: string;
    email: string;
    password: string;
    phone: string;
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
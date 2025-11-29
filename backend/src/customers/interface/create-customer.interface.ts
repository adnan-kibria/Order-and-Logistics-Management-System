/* eslint-disable prettier/prettier */
import { ShippingAddresses } from "src/shipping-addresses/entities/shipping-addresses.entity";
import { Users } from "src/users/entities/users.entity";

export class CustomerInterface {
    name: string;
    phone: string;
    user: Users;
    shippingAddress: ShippingAddresses;

}
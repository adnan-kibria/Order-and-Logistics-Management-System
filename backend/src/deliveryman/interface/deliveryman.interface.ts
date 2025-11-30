import { Users } from "src/users/entities/users.entity";

export interface DeliverymanInterface {
    name: string;
    phone: string;
    user: Users;
}
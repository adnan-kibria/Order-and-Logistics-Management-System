import { Users } from "src/users/entities/users.entity";

export interface InventoryManagerInterface {
    name: string;
    phone: string;
    user: Users;
}
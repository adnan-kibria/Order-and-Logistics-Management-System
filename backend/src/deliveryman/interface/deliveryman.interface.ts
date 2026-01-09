import { Users } from "src/users/entities/users.entity";

export interface DeliverymanInterface {
    name: string;
    phone: string;
    user: Users;
}
export interface IOrder {
  id: number;
  deliverymanId: number;
  status: 'assigned' | 'on_the_way' | 'delivered' | 'pending';
  items: string;
  deliveredAt?: Date;
}
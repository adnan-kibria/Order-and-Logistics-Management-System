import { Users } from "src/users/entities/users.entity";

// Main Deliveryman Interface
export interface DeliverymanInterface {
   name: string;
    phone: string;
    user: Users;
}
// Order Interface (Used for Deliveryman operations)
export interface IOrder {
  id: number;
  deliverymanId: number;
  status: 'assigned' | 'on_the_way' | 'delivered' | 'pending';
  items: string;
  deliveredAt?: Date;
}
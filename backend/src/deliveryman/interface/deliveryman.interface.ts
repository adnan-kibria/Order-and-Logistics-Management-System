// Main Deliveryman Interface
export interface DeliverymanInterface {
  id?: number;
  name: string;
  email?: string;      
  phone: string;
  vehicleType?: string; 
  isActive?: boolean;
  user?: any; 
}
// Order Interface (Used for Deliveryman operations)
export interface IOrder {
  id: number;
  deliverymanId: number;
  status: 'assigned' | 'on_the_way' | 'delivered' | 'pending';
  items: string;
  deliveredAt?: Date;
}
export interface Order {
  id: number;
  date: string;
  productTotal: number;
  total: number;
  shippingCharge: number;
  customer: {
    id: number;
    name: string;
    phone: string;
  };
  orderStatus: {
    id: number;
    status: string;
  };
  deliveryman?: {
    id: number;
    name: string;
  };
}
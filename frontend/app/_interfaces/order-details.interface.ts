export interface IOrder {
    id: number;
    date: Date;
    productTotal: number;
    total: number;
    shippingCharge: number;
    cancelledBy: string | null;
    cancelledAt: Date | null;
    deliveredAt: Date | null;
    customer: ICustomer;
    orderStatus: IOrderStatus;
    orderDetails: IOrderDetail[];
}

export interface ICustomer {
    id: number;
    name: string;
    phone: string;
    shippingAddress: IShippingAddress;
}

export interface IShippingAddress {
    id: number;
    city: string;
    location: string;
    details: string;
}

export interface IOrderStatus {
    id: number;
    status: string;
}

export interface IOrderDetail {
    id: number;
    qty: number;
    orderPrice: number;
    product: IProduct;
}

export interface IProduct {
    id: number;
    name: string;
    stockQty: number;
    price: number;
    discount: number;
}

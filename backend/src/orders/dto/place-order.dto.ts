/* eslint-disable prettier/prettier */
import { Products } from "src/products/entities/products.entity";

export class OrderItemDTO {
    product: Products;
    orderPrice: number;
    qty: number;
}

export class PlaceOrderDTO {
    customerId: number;
    shippingCharge: number;
    orderItems: OrderItemDTO[];
}
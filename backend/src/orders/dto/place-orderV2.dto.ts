/* eslint-disable prettier/prettier */
import {
    IsInt,
    IsPositive,
} from "class-validator";



export class OrderItemDTO {
    @IsInt({ message: 'productId must be an integer' })
    @IsPositive({ message: 'productId must be a positive number' })
    productId: number;

    @IsInt({ message: 'qty must be an integer' })
    @IsPositive({ message: 'qty must be greater than 0' })
    qty: number;
}

export class PlaceOrderDTO {
    orderItems: OrderItemDTO[];
}
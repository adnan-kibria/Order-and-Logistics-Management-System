/* eslint-disable prettier/prettier */
import { Products } from "src/products/entities/products.entity";
import {
    IsInt,
    IsPositive,
    IsNumber,
    Min,
    ValidateNested,
    IsArray,
} from "class-validator";
import { Type } from "class-transformer";


export class OrderItemDTO {
    @ValidateNested()
    @Type(() => Products)
    product: Products;

    @IsNumber()
    @IsPositive()
    orderPrice: number;

    @IsInt()
    @Min(1)
    qty: number;

}

export class PlaceOrderDTO {
    @IsInt()
    @IsPositive()
    customerId: number;

    @IsNumber()
    @Min(0)                        
    shippingCharge: number;

    @IsArray()
    @ValidateNested({ each: true }) 
    @Type(() => OrderItemDTO)      
    orderItems: OrderItemDTO[]
}
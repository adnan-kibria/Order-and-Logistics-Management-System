/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class CreateShippingAddress {
    @IsString()
    city: string;
    @IsString()
    location: string;
    @IsString()
    details: string ;
}
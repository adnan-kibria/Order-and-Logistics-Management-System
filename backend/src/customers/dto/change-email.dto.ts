/* eslint-disable prettier/prettier */
import { IsInt, IsPositive, IsEmail } from 'class-validator';

export class ChangeEmailDTO {
  @IsInt()              
  @IsPositive()         
  customerId: number;

  @IsEmail()            
  email: string;
}
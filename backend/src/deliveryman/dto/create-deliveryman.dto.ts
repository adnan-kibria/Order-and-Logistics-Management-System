import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDeliverymanDto {
  name: string;
  email: string;
  password: string;
  phone: string;
}
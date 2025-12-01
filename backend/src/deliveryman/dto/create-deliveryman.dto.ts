import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDeliverymanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  vehicleType: string;
}
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";

export class CreateInventoryManagerDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces.' })
    name: string;
    @IsNotEmpty({ message: 'Email must not be empty.' })
    @IsEmail({}, { message: 'Must be a valid email address format (e.g., user@example.com).' })
    email: string;
    @IsNotEmpty({ message: 'Password must not be empty.' })
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
    })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    password: string;
    @IsNotEmpty({ message: 'Phone number must not be empty.' })
    @IsPhoneNumber('BD', { message: 'Phone number must be a valid Bangladeshi phone number.' })
    phone: string;
}
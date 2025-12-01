/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Length, Matches, Min, MinLength } from "class-validator";
export class CreateUser {
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
    @IsNotEmpty({ message: 'Role must not be empty.' })
    @IsString({ message: 'Role must be a string.' })
    role: string
}
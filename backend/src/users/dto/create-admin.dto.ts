/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
export class CreateAdmin {
    @IsNotEmpty({ message: 'Email must not be empty.' })
    @IsEmail({}, { message: 'Must be a valid email address format (user@example.com).' })
    email: string;
    @IsNotEmpty({ message: 'Password must not be empty.' })
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
    })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    password: string;
}
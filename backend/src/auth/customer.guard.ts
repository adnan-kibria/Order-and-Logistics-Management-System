/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

export interface JwtPayload {
    sub: string;
    role: string;
    iat: number;
    exp: number;
}

@Injectable()
export class CustomerGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const token: string = request.cookies['jwt'];
        if (!token) {
            throw new UnauthorizedException('No JWT token found');
        }

        console.log('Token in CustomerGuard:', token);  
        try {
            const data: JwtPayload = await this.jwtService.verifyAsync(token);

            if (data.role === 'customer') {
                return true; // allow access
            } else {
                throw new UnauthorizedException('Not an admin');
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }

    }
}

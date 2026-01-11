/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */

import { Body, Controller, HttpCode, HttpStatus, Post, Request, Res, UnauthorizedException, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import express from 'express';
import { JwtService } from '@nestjs/jwt';
import { CustomerGuard } from './customer.guard';
import { AdminGuard } from './admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: LoginDTO, @Res({ passthrough: true }) res: express.Response): Promise<string> {
    const access_token = await this.authService.signIn(dto.email, dto.password);

    res.cookie('jwt', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 3600 * 1000,
    });

    return access_token;
  }

  @Post('user')
  async user(@Request() req: express.Request): Promise<any> {
    const token: string = req.cookies['jwt'];
    if (!token) throw new UnauthorizedException();

    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET || 'secretkey' });
    return payload;
  }

  @Post('customer')
  @UseGuards(CustomerGuard)
  getCustomer() {
    return "customer";
  }
  @Post('admin')
  @UseGuards(AdminGuard)
  getAdmin() {
    return "admin";
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response): { message: string } {
    try {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
    }
    catch (error) {
      throw new UnauthorizedException();
    }
    return { message: 'Logged out' };
  }
}

/* eslint-disable prettier/prettier */

import {Body, Controller, HttpCode, HttpStatus, Post, Request, Res,UnauthorizedException,} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import express from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: LoginDTO, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.signIn(dto.email, dto.password);

    res.cookie('jwt', result.access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
    });

    return { id: result.id, email: result.email, role: result.role };
  }

  @Post('user')
  async user(@Request() req: express.Request) {
    const token = req.cookies?.jwt;
    if (!token) throw new UnauthorizedException();

    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET || 'secretkey' });
    return payload;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return { message: 'Logged out' };
  }
}

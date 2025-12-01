/* eslint-disable prettier/prettier */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; id: string; email: string; role: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      id: user.userId,
      email: user.email,
      role: user.role,
    };
  }
}

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const loginResult = await this.usersService.login({ email, password });

      if (!loginResult.access_token) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return { email, access_token: loginResult.access_token };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}

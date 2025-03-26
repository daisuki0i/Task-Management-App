import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { RequestWithUser } from '../types/jwt-payload';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: RequestWithUser) {
    // LocalStrategy already authenticated the user and attached the user to the request
    return req.user;
  }
  
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.usersService.register(user);
  }
}

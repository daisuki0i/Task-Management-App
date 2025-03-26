import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from 'src/dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users) private readonly usersRepository: typeof Users,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: LoginUserDto) {
    const foundUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    // Now we can safely compare the passwords
    if (
      foundUser &&
      foundUser.dataValues &&
      bcrypt.compareSync(user.password, foundUser.dataValues.password)
    ) {
      const payload = { email: user.email, sub: foundUser.dataValues.id };
      return {
        access_token: this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '60m',
        }),
      };
    }

    return {
      message: 'Invalid credentials',
    };
  }

  async register(user: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = await this.usersRepository.create({
      email: user.email,
      password: hashedPassword,
    });
    return newUser;
  }

  async findUserById(id: string) {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }
}
